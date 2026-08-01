-- Ticket #006A: patient-owned daily check-in records.
-- Responses are stored as raw patient reports. This migration intentionally
-- defines no recovery score, alert classification, provider access, or delete
-- access for mobile clients.

create table public.patient_check_ins (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null
    constraint patient_check_ins_patient_fkey
    references public.patients (id)
    on delete restrict,
  organization_id uuid
    constraint patient_check_ins_organization_fkey
    references public.organizations (id)
    on delete restrict,
  check_in_date date not null,
  submitted_utc_offset_minutes smallint not null
    constraint patient_check_ins_utc_offset_check
    check (submitted_utc_offset_minutes between -720 and 840),
  symptom_intensity smallint not null
    constraint patient_check_ins_symptom_intensity_check
    check (symptom_intensity between 0 and 10),
  symptom_change text not null
    constraint patient_check_ins_symptom_change_check
    check (
      symptom_change in (
        'much_better',
        'a_little_better',
        'about_the_same',
        'a_little_worse',
        'much_worse'
      )
    ),
  sleep_quality smallint not null
    constraint patient_check_ins_sleep_quality_check
    check (sleep_quality between 1 and 5),
  energy_level smallint not null
    constraint patient_check_ins_energy_level_check
    check (energy_level between 1 and 5),
  concerning_change boolean not null,
  note text
    constraint patient_check_ins_note_length_check
    check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint patient_check_ins_patient_date_key
    unique (patient_id, check_in_date)
);

create index patient_check_ins_organization_date_idx
  on public.patient_check_ins (organization_id, check_in_date desc)
  where organization_id is not null;

-- This function runs only through the table trigger. It derives tenant and
-- local-date context from authoritative/server inputs and makes those fields
-- immutable after insertion. Direct execution is revoked below.
create or replace function private.prepare_patient_check_in()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  write_timestamp timestamptz := statement_timestamp();
begin
  if tg_op = 'INSERT' then
    select patient.organization_id
      into new.organization_id
    from public.patients patient
    where patient.id = new.patient_id;

    new.check_in_date := (
      write_timestamp at time zone 'UTC'
      + make_interval(mins => new.submitted_utc_offset_minutes)
    )::date;
    new.created_at := write_timestamp;
  else
    new.patient_id := old.patient_id;
    new.organization_id := old.organization_id;
    new.check_in_date := old.check_in_date;
    new.submitted_utc_offset_minutes := old.submitted_utc_offset_minutes;
    new.created_at := old.created_at;
  end if;

  if new.note is not null and btrim(new.note) = '' then
    new.note := null;
  end if;

  new.updated_at := write_timestamp;
  return new;
end;
$$;

revoke all on function private.prepare_patient_check_in()
from public, anon, authenticated;

create trigger patient_check_ins_prepare_write
before insert or update on public.patient_check_ins
for each row execute function private.prepare_patient_check_in();

alter table public.patient_check_ins enable row level security;

revoke all on table public.patient_check_ins from public, anon, authenticated;

grant select on table public.patient_check_ins to authenticated;

grant insert (
  patient_id,
  submitted_utc_offset_minutes,
  symptom_intensity,
  symptom_change,
  sleep_quality,
  energy_level,
  concerning_change,
  note
) on table public.patient_check_ins to authenticated;

grant update (
  symptom_intensity,
  symptom_change,
  sleep_quality,
  energy_level,
  concerning_change,
  note
) on table public.patient_check_ins to authenticated;

create policy "Patients can read their own check-ins"
on public.patient_check_ins
for select
to authenticated
using (private.is_patient_owner(patient_id));

create policy "Patients can create their own check-ins"
on public.patient_check_ins
for insert
to authenticated
with check (private.is_patient_owner(patient_id));

create policy "Patients can update their own check-ins"
on public.patient_check_ins
for update
to authenticated
using (
  private.is_patient_owner(patient_id)
  and check_in_date = (
    statement_timestamp() at time zone 'UTC'
    + make_interval(mins => submitted_utc_offset_minutes)
  )::date
)
with check (
  private.is_patient_owner(patient_id)
  and check_in_date = (
    statement_timestamp() at time zone 'UTC'
    + make_interval(mins => submitted_utc_offset_minutes)
  )::date
);
