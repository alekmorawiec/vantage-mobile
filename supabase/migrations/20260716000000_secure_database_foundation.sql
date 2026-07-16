-- Ticket #003: secure, multi-tenant database foundation.
-- This migration intentionally grants no client-side create or delete access.

create schema if not exists private;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  status text not null default 'active'
    constraint organizations_status_check
    check (status in ('active', 'suspended', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  timezone text not null default 'America/Los_Angeles',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id)
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('admin', 'provider', 'staff')),
  status text not null check (status in ('invited', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, profile_id),
  unique (profile_id, organization_id)
);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique not null references public.profiles (id) on delete cascade,
  organization_id uuid references public.organizations (id) on delete restrict,
  clinic_id uuid,
  status text not null default 'active'
    constraint patients_status_check
    check (status in ('active', 'inactive', 'discharged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id),
  constraint patients_clinic_requires_organization
    check (clinic_id is null or organization_id is not null),
  constraint patients_clinic_organization_fkey
    foreign key (clinic_id, organization_id)
    references public.clinics (id, organization_id)
    on delete set null (clinic_id)
);

create table public.provider_patient_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  provider_profile_id uuid not null references public.profiles (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (provider_profile_id, patient_id),
  constraint assignments_provider_membership_fkey
    foreign key (provider_profile_id, organization_id)
    references public.organization_memberships (profile_id, organization_id)
    on delete cascade,
  constraint assignments_patient_organization_fkey
    foreign key (patient_id, organization_id)
    references public.patients (id, organization_id)
    on delete cascade
);

create index clinics_organization_id_idx
  on public.clinics (organization_id);
create index organization_memberships_profile_id_idx
  on public.organization_memberships (profile_id);
create index organization_memberships_active_lookup_idx
  on public.organization_memberships (organization_id, profile_id, role)
  where status = 'active';
create index patients_organization_id_idx
  on public.patients (organization_id);
create index patients_clinic_id_idx
  on public.patients (clinic_id);
create index provider_patient_assignments_organization_id_idx
  on public.provider_patient_assignments (organization_id);
create index provider_patient_assignments_patient_id_idx
  on public.provider_patient_assignments (patient_id);
create index provider_patient_assignments_active_provider_idx
  on public.provider_patient_assignments (provider_profile_id, patient_id, organization_id)
  where active;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function private.set_updated_at();

create trigger clinics_set_updated_at
before update on public.clinics
for each row execute function private.set_updated_at();

create trigger organization_memberships_set_updated_at
before update on public.organization_memberships
for each row execute function private.set_updated_at();

create trigger patients_set_updated_at
before update on public.patients
for each row execute function private.set_updated_at();

create or replace function private.validate_assignment_provider_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.organization_memberships membership
    where membership.profile_id = new.provider_profile_id
      and membership.organization_id = new.organization_id
      and membership.role = 'provider'
      and membership.status = 'active'
  ) then
    raise exception using
      errcode = '23514',
      message = 'Assignment provider must have an active provider membership in the assignment organization';
  end if;

  return new;
end;
$$;

create trigger provider_patient_assignments_validate_provider
before insert or update of organization_id, provider_profile_id
on public.provider_patient_assignments
for each row execute function private.validate_assignment_provider_membership();

-- This trigger runs inside the Auth transaction. Any uncaught error here can
-- block signup, so keep it small, deterministic, and free of external work.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    nullif(btrim(new.raw_user_meta_data ->> 'name'), '')
  )
  on conflict (id) do update
  set email = excluded.email,
      display_name = coalesce(public.profiles.display_name, excluded.display_name);

  insert into public.patients (profile_id)
  values (new.id)
  on conflict (profile_id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

-- A failing auth.users trigger can prevent account creation. Test this trigger
-- locally before applying the migration to a linked or production project.
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- SECURITY DEFINER helpers centralize membership checks and avoid recursive RLS
-- evaluation between patients, assignments, and memberships.
create or replace function private.is_active_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    join public.organizations organization
      on organization.id = membership.organization_id
    where membership.organization_id = target_organization_id
      and membership.profile_id = auth.uid()
      and membership.status = 'active'
      and organization.status = 'active'
  );
$$;

create or replace function private.is_active_organization_admin(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    join public.organizations organization
      on organization.id = membership.organization_id
    where membership.organization_id = target_organization_id
      and membership.profile_id = auth.uid()
      and membership.role = 'admin'
      and membership.status = 'active'
      and organization.status = 'active'
  );
$$;

create or replace function private.is_patient_owner(target_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.patients patient
    where patient.id = target_patient_id
      and patient.profile_id = auth.uid()
  );
$$;

create or replace function private.is_active_assigned_provider(target_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.provider_patient_assignments assignment
    join public.organization_memberships membership
      on membership.organization_id = assignment.organization_id
     and membership.profile_id = assignment.provider_profile_id
    join public.organizations organization
      on organization.id = assignment.organization_id
    where assignment.patient_id = target_patient_id
      and assignment.provider_profile_id = auth.uid()
      and assignment.active
      and membership.role = 'provider'
      and membership.status = 'active'
      and organization.status = 'active'
  );
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on all functions in schema private from public;
grant execute on function private.is_active_organization_member(uuid) to authenticated;
grant execute on function private.is_active_organization_admin(uuid) to authenticated;
grant execute on function private.is_patient_owner(uuid) to authenticated;
grant execute on function private.is_active_assigned_provider(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.clinics enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.patients enable row level security;
alter table public.provider_patient_assignments enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.organizations from anon, authenticated;
revoke all on table public.clinics from anon, authenticated;
revoke all on table public.organization_memberships from anon, authenticated;
revoke all on table public.patients from anon, authenticated;
revoke all on table public.provider_patient_assignments from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;
grant select on table public.organizations to authenticated;
grant select on table public.clinics to authenticated;
grant select on table public.organization_memberships to authenticated;
grant select on table public.patients to authenticated;
grant select on table public.provider_patient_assignments to authenticated;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their own display name"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Active members can read their organization"
on public.organizations
for select
to authenticated
using (private.is_active_organization_member(id));

create policy "Active members can read organization clinics"
on public.clinics
for select
to authenticated
using (private.is_active_organization_member(organization_id));

create policy "Users can read their own memberships"
on public.organization_memberships
for select
to authenticated
using ((select auth.uid()) = profile_id);

create policy "Patients providers and admins can read patients"
on public.patients
for select
to authenticated
using (
  (select auth.uid()) = profile_id
  or private.is_active_assigned_provider(id)
  or private.is_active_organization_admin(organization_id)
);

create policy "Related users and admins can read assignments"
on public.provider_patient_assignments
for select
to authenticated
using (
  private.is_patient_owner(patient_id)
  or private.is_active_assigned_provider(patient_id)
  or private.is_active_organization_admin(organization_id)
);
