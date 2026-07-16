# Vantage Database Architecture

## Scope

This document describes the first version-controlled Supabase database foundation for Vantage. It defines identity, organization tenancy, clinic membership, patient records, and provider-to-patient assignments. It does not link or modify the remote Supabase project, and it does not change the mobile authentication flow.

## Identity and provisioning

`public.profiles` is a one-to-one application identity record for `auth.users`. The authoritative identity key is the UUID shared by `auth.users.id` and `profiles.id`; email is a nullable contact/login attribute, not an identity key. An `auth.users` `AFTER INSERT` trigger calls `public.handle_new_user()` to create a profile and a patient record for every future signup.

The trigger copies only the user's email and optional `raw_user_meta_data.name`. It never reads a role from signup metadata and never creates an organization membership. Provider, staff, and administrator access must be provisioned later by a trusted server-side or administrator workflow.

The trigger is idempotent where practical: profile conflicts refresh the nullable email without overwriting an existing display name, and an existing patient record is left unchanged. It copies `auth.users.email` when present and stores `NULL` when Auth has no email; it never fabricates a placeholder address. Because the trigger runs within the Auth transaction, an uncaught trigger error can block signup. It must be migration-tested before remote deployment.

The follow-up migration `20260716010000_backfill_existing_auth_users.sql` provisions missing profiles and patient rows for Auth users created before the trigger existed. It is idempotent, preserves all existing application rows, and does not create organization memberships or interpret role metadata. Backfilled patient rows omit `organization_id` and `clinic_id`, so both remain `NULL` until a trusted enrollment workflow assigns the patient.

## Tenant model

- `organizations` is the tenant boundary.
- `clinics` belongs to exactly one organization.
- `organization_memberships` is the authoritative source for admin, provider, and staff roles and membership status.
- `patients` can exist without an organization immediately after self-registration and may later be enrolled in one organization and optionally one clinic.
- `provider_patient_assignments` connects a provider membership to a patient in the same organization.

Composite foreign keys enforce that a patient's clinic belongs to the patient's organization and that assignments use the same organization as both the patient and provider membership. A database `CHECK` prevents setting a clinic before an organization. Organization status is constrained to `active`, `suspended`, or `archived`; patient status is constrained to `active`, `inactive`, or `discharged`.

Simple foreign keys cannot enforce that an assigned membership is both `active` and has role `provider`. A private validation trigger therefore rejects assignment inserts and relevant updates unless the referenced membership currently has role `provider` and status `active`. The composite foreign key remains in place to enforce organization consistency. If a membership is later disabled or changed to another role, existing assignments remain stored but immediately stop granting provider read access; a future trusted membership workflow may additionally deactivate or remove them.

## Row-Level Security

RLS is enabled on every public table, and policies are explicitly targeted to `authenticated`. The `anon` and `authenticated` roles begin with all table privileges revoked; authenticated users receive only the `SELECT` privileges needed by the initial policies plus column-level `UPDATE (display_name)` on their own profile.

Access is intentionally limited:

- Users can read their own profile and update only its `display_name`.
- Active members can read their organization and its clinics only while the organization itself is active.
- Users can read only their own membership rows.
- Patients can read their own patient row and assignments involving it.
- Active assigned providers can read their assigned patient rows and active assignment rows only while the organization is active.
- Active organization admins can read patients and assignments within their organization only while the organization is active.
- No client mutation policy exists for organizations, clinics, memberships, patients, or assignments.

Small `SECURITY DEFINER` predicate functions in the non-exposed `private` schema perform membership and relationship checks, including the organization's current status. Their empty `search_path`, fully qualified relations, restricted execute grants, and boolean-only results reduce attack surface. They also avoid recursive policy evaluation between memberships, patients, and assignments. Suspending or archiving an organization therefore removes tenant-scoped reads without changing its membership rows.

## Timestamps and indexes

A shared trigger function maintains `updated_at` for every table that defines that column. Foreign keys and common RLS lookup paths have supporting indexes, including partial indexes for active memberships and assignments.

## Local workflow

The foundation and existing-user backfill are stored as ordered migrations under `supabase/migrations`. The local config disables seeding because this foundation needs no fixture data.

The intended full validation workflow is:

```sh
npx supabase start
npx supabase db reset
```

These commands require a working Supabase CLI and Docker. They must not be run against a linked remote project. Static review and the application TypeScript check do not require Docker.
