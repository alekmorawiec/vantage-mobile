-- Provision application records for Auth users created before the foundation
-- migration installed the auth.users creation trigger.

insert into public.profiles (id, email, display_name)
select
  auth_user.id,
  auth_user.email,
  nullif(btrim(auth_user.raw_user_meta_data ->> 'name'), '')
from auth.users auth_user
where not exists (
  select 1
  from public.profiles profile
  where profile.id = auth_user.id
)
on conflict (id) do nothing;

insert into public.patients (profile_id)
select auth_user.id
from auth.users auth_user
where not exists (
  select 1
  from public.patients patient
  where patient.profile_id = auth_user.id
)
on conflict (profile_id) do nothing;
