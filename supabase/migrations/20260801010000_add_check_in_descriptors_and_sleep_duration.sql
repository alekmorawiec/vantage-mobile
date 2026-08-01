-- Ticket #006B follow-up: add raw symptom descriptors and sleep duration
-- without fabricating a duration for check-ins that already exist.

alter table public.patient_check_ins
  add column symptom_descriptors text[] not null default '{}'::text[],
  add column sleep_duration_minutes smallint;

alter table public.patient_check_ins
  add constraint patient_check_ins_symptom_descriptors_values_check
    check (
      array_position(symptom_descriptors, null) is null
      and symptom_descriptors <@ array[
        'sharp',
        'dull',
        'achy',
        'throbbing',
        'burning',
        'tingling',
        'numbness',
        'stiffness',
        'pressure',
        'other'
      ]::text[]
    ),
  add constraint patient_check_ins_symptom_descriptors_cardinality_check
    check (cardinality(symptom_descriptors) <= 3),
  add constraint patient_check_ins_symptom_descriptors_unique_check
    check (
      cardinality(array_positions(symptom_descriptors, 'sharp')) <= 1
      and cardinality(array_positions(symptom_descriptors, 'dull')) <= 1
      and cardinality(array_positions(symptom_descriptors, 'achy')) <= 1
      and cardinality(array_positions(symptom_descriptors, 'throbbing')) <= 1
      and cardinality(array_positions(symptom_descriptors, 'burning')) <= 1
      and cardinality(array_positions(symptom_descriptors, 'tingling')) <= 1
      and cardinality(array_positions(symptom_descriptors, 'numbness')) <= 1
      and cardinality(array_positions(symptom_descriptors, 'stiffness')) <= 1
      and cardinality(array_positions(symptom_descriptors, 'pressure')) <= 1
      and cardinality(array_positions(symptom_descriptors, 'other')) <= 1
    ),
  add constraint patient_check_ins_sleep_duration_range_check
    check (
      sleep_duration_minutes is null
      or sleep_duration_minutes between 0 and 1440
    ),
  add constraint patient_check_ins_sleep_duration_required_for_writes_check
    check (sleep_duration_minutes is not null) not valid;

grant insert (
  symptom_descriptors,
  sleep_duration_minutes
) on table public.patient_check_ins to authenticated;

grant update (
  symptom_descriptors,
  sleep_duration_minutes
) on table public.patient_check_ins to authenticated;
