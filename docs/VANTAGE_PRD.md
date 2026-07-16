# Vantage Product Requirements Document

Version: 0.1  
Status: Feasibility / MVP planning  
Owner: Alek Morawiec

## 1. Product vision

Vantage is a physical therapy and performance platform that combines patient engagement, clinical outcomes, home-exercise adherence, and objective performance testing into one coordinated experience.

The initial product is a single mobile application with role-based experiences:

- Patients use Vantage to complete check-ins, track exercises, view progress, access resources, and understand recovery.
- Providers use Vantage to manage caseloads, review adherence, monitor outcomes, inspect VALD-derived metrics, and identify patients who need attention.
- Administrators will later manage clinics, providers, invitations, permissions, and billing.

The long-term product goal is to become a clinic-facing clinical intelligence and patient-engagement platform rather than only a home-exercise application.

## 2. Product principles

1. One codebase, separate role-based experiences.
2. Patients may self-register; providers are invite-only.
3. Security and authorization are enforced in the backend, not only in the interface.
4. Objective performance data must be understandable to both patients and clinicians.
5. Every major feature should support a measurable clinical or operational outcome.
6. Build for feasibility first, then harden for pilot use.
7. Avoid premature EMR integration until the core workflow is validated.

## 3. Target users

### Patient

A person receiving physical therapy or performance care who needs to:

- Complete daily or pre-visit check-ins.
- Follow a prescribed home exercise program.
- Track adherence and activity.
- Review progress in understandable language.
- Access clinic-assigned resources.
- Receive reminders and appointment information.

### Provider

A physical therapist, athletic trainer, or performance clinician who needs to:

- Review a caseload.
- Identify low adherence or worsening symptoms.
- Inspect outcome and performance trends.
- Assign exercises and educational resources.
- Review patient check-ins and activity.
- Document or export relevant summaries later.

### Clinic administrator

A clinic owner or authorized staff member who will eventually need to:

- Create and manage organizations and clinics.
- Invite providers.
- Manage patient enrollment.
- Control permissions.
- Review usage and billing.
- Configure integrations.

## 4. MVP scope

### Authentication

- Email/password sign-up for patients.
- Email/password login for all approved users.
- Persistent mobile sessions.
- Logout.
- Provider accounts cannot be created through public registration.
- Provider role must eventually come from protected database membership records.
- Password reset.
- Native confirmation/deep-link handling before beta release.

### Patient experience

- Home dashboard.
- Daily check-in.
- Home exercise program.
- Weekly adherence view.
- Additional activity log.
- Progress overview.
- Outcome measure trends.
- VALD metric trends.
- Resources.
- Profile and account settings.

### Provider experience

- Provider dashboard.
- Caseload list.
- Patient detail.
- Latest check-in.
- Adherence status.
- Outcome and VALD trends.
- Activity log.
- Add test result during feasibility.
- Assign resources.
- Provider alert states.

### Data and backend

- Supabase Authentication.
- PostgreSQL database.
- Row-Level Security on all exposed tables.
- Organization-based tenancy.
- Clinic and provider memberships.
- Patient-provider relationships.
- Audit-friendly timestamps.
- Database migrations stored in the repository.

## 5. Out of scope for initial MVP

- Production WebPT integration.
- Production VALD API integration.
- Medical billing.
- Insurance claims.
- Clinical documentation replacement.
- AI-generated medical recommendations.
- Automated return-to-sport clearance.
- Apple Health.
- Wearables.
- Secure messaging.
- Multi-language support.
- App Store public release.

These may be revisited after the feasibility workflow is validated.

## 6. Core information architecture

### Patient tabs

1. Home
2. Progress
3. Check-In
4. Workouts
5. Resources

### Provider sections

1. Dashboard
2. Caseload
3. Patient Detail
4. Resources
5. Profile

A formal navigation library should replace conditional rendering before the screen count expands further.

## 7. Proposed database model

### profiles

Application identity linked one-to-one with `auth.users`.

Suggested fields:

- id
- email
- display_name
- created_at
- updated_at

Do not rely on editable user metadata for authorization.

### organizations

Represents the paying customer or parent entity.

Suggested fields:

- id
- name
- slug
- status
- created_at
- updated_at

### clinics

Represents a clinic or location within an organization.

Suggested fields:

- id
- organization_id
- name
- timezone
- created_at
- updated_at

### organization_memberships

Authoritative role and membership record.

Suggested fields:

- id
- organization_id
- profile_id
- role: admin, provider, staff
- status: invited, active, disabled
- created_at
- updated_at

### patients

Clinical patient profile.

Suggested fields:

- id
- profile_id
- organization_id
- clinic_id
- status
- created_at
- updated_at

### provider_patient_assignments

Defines which providers may access which patients.

Suggested fields:

- id
- provider_profile_id
- patient_id
- active
- created_at

### care_plans

Suggested fields:

- id
- patient_id
- provider_profile_id
- name
- status
- start_date
- expected_end_date
- created_at
- updated_at

### exercises

Global or organization-owned exercise definitions.

### exercise_prescriptions

Exercises assigned through a care plan.

### exercise_sessions

Patient completion records.

### check_ins

Suggested fields:

- id
- patient_id
- pain_score
- worsening_symptoms
- sleep_quality
- notes
- submitted_at
- updated_at

### activities

Patient-reported activity outside the prescribed program.

### outcome_measure_definitions

Defines LEFS and future measures.

### outcome_measure_results

Stores scored outcomes by date or visit.

### vald_test_results

Stores normalized test summaries during feasibility.

Suggested fields:

- id
- patient_id
- provider_profile_id
- test_type
- tested_at
- source
- raw_payload
- normalized_metrics
- created_at

### resources

Clinic-assigned videos, documents, or articles.

### resource_assignments

Links resources to patients, care plans, programs, or organizations.

## 8. Authorization model

Authorization must be enforced with Supabase Row-Level Security.

Minimum rules:

- A patient may read and update only their own permitted records.
- A provider may access only patients assigned to them within an active organization membership.
- An administrator may manage users and resources only within their organization.
- Public users may not create provider memberships.
- Client-provided roles must never grant authorization.
- Service-role credentials must never be included in the mobile application.
- Provider invitations must be created by a trusted server or administrator workflow.

## 9. Recovery score

Recovery Score is a product hypothesis, not yet a validated clinical measure.

Potential inputs:

- Pain trend.
- Worsening symptoms.
- Sleep quality.
- Exercise adherence.
- Activity load.
- Outcome score trend.
- VALD asymmetry or performance trend.

Initial feasibility guidance:

- Label it clearly as a Vantage summary score.
- Do not imply medical clearance.
- Show the contributing factors.
- Allow clinicians to inspect the raw inputs.
- Do not use it for autonomous treatment recommendations.
- Validate usefulness with clinicians before making it central to clinical decisions.

## 10. VALD strategy

Initial feasibility:

- Model a generic normalized test-result schema.
- Support manual entry or sample imports.
- Display clear metrics such as limb symmetry index and trend.
- Preserve a raw source payload field for future integration.
- Avoid coupling the app to one test type.

Later:

- Investigate VALD API access, commercial terms, consent, data ownership, and rate limits.
- Create a server-side ingestion adapter.
- Store external identifiers separately.
- Normalize only the metrics required by Vantage workflows.

## 11. WebPT strategy

WebPT is deferred.

Before implementation, confirm:

- API availability and partner requirements.
- Supported patient, appointment, and documentation endpoints.
- Data-use restrictions.
- Authentication approach.
- Commercial agreements.
- Whether write-back is permitted.

The MVP should not depend on WebPT.

## 12. Monetization hypotheses

Primary model:

- B2B SaaS subscription paid by clinics.

Possible pricing dimensions:

- Per provider per month.
- Per active patient per month.
- Tiered clinic plans.
- Analytics or integration add-ons.
- Enterprise contracts for multi-location practices.
- White-label or branded patient experiences later.

The initial product should validate:

1. Do providers use the dashboard?
2. Does patient engagement improve?
3. Does objective-data aggregation save clinical time?
4. Which feature causes a clinic to pay?

Do not finalize pricing before pilot interviews and workflow validation.

## 13. Technical architecture

### Mobile

- Expo React Native.
- TypeScript.
- Feature-based source organization.
- Shared design system.
- Formal navigation.
- Supabase JavaScript client.
- AsyncStorage-backed auth session.
- Environment variables through Expo public variables.
- No secret server credentials in the app.

### Backend

- Supabase Auth.
- PostgreSQL.
- Row-Level Security.
- SQL migrations committed to Git.
- Supabase Edge Functions for trusted workflows later.
- Storage buckets for resources later.

### Repository expectations

- TypeScript strictness should be preserved.
- No unreviewed large dependencies.
- Feature work should be committed by milestone.
- `.env.local` must not be committed.
- `.env.example` should contain placeholders only.
- Database schema changes must use migrations.
- Business rules should not live solely in UI components.

## 14. Milestones

### Milestone 1: Development foundation

Status: Complete

- Expo project.
- iPhone development through Expo Go.
- GitHub repository.
- Design system foundation.
- Patient/provider prototype screens.

### Milestone 2: Authentication

Status: Complete for feasibility

- Supabase connection.
- Patient self-registration.
- Persistent sessions.
- Login/logout.
- Provider public registration removed.

Remaining before beta:

- Password reset.
- Native email-confirmation deep link.
- Protected database role and membership model.
- Provider invitation flow.

### Milestone 3: Database foundation

Next

- Add Supabase CLI project structure.
- Create migrations.
- Add profiles, organizations, clinics, memberships, patients, and assignments.
- Add RLS.
- Create profile provisioning trigger.
- Replace metadata-based authorization.

### Milestone 4: Navigation and patient MVP

- Formal navigation.
- Patient tabs.
- Check-in persistence.
- HEP persistence.
- Progress data.
- Resources.

### Milestone 5: Provider MVP

- Caseload query.
- Patient detail.
- Adherence and symptom alerts.
- Manual VALD result entry.
- Resource assignment.

### Milestone 6: Pilot readiness

- Error monitoring.
- Privacy policy.
- Terms.
- Account deletion.
- Data export considerations.
- TestFlight build.
- Internal pilot.

## 15. Success criteria for feasibility

- A patient can create an account and remain logged in.
- A provider account cannot be self-created.
- A patient can submit a check-in.
- An assigned provider can review that check-in.
- A patient can record exercise adherence.
- A provider can identify low adherence.
- A provider can review at least one objective metric trend.
- Data access is correctly separated with RLS.
- A clinician can complete the main review workflow without training.
- At least three target users provide structured feedback.

## 16. Open product questions

- Who is the first paying customer profile?
- Is the first pilot a clinic, university, sports team, or performance facility?
- Who enrolls patients?
- Should patients self-register before receiving a clinic invite?
- What objective tests matter most after ACL reconstruction?
- How should providers override or annotate a Recovery Score?
- What data should patients see versus providers?
- What is the smallest workflow that saves providers meaningful time?
- Is mobile sufficient for providers, or is a web dashboard required for pilot use?

## 17. Decision log

### One app versus two apps

Decision: One mobile codebase with role-based experiences.

Reason:

- Lower development and maintenance cost.
- Shared authentication and design system.
- One App Store product.
- Role separation can still be strict.
- Authorization belongs in the backend.

Revisit only if provider workflows become substantially better suited to a desktop-first product.

### Provider registration

Decision: Invite-only.

Reason:

- Public provider self-registration is unsafe.
- An embedded admin password is not secure.
- Provider authorization must come from protected organization membership.

### Initial integrations

Decision: Defer WebPT; model VALD generically and use manual/sample data first.

Reason:

- Validate workflows before investing in partner integrations.
