# Vantage ChatGPT and Codex Workflow

## Purpose

Use ChatGPT as the planning, architecture, review, and decision layer.

Use Codex as the repository implementation layer.

## Use ChatGPT for

- Product strategy.
- Feature prioritization.
- Architecture decisions.
- Database and RLS design.
- Security reviews.
- UX decisions.
- Monetization.
- Integration planning.
- Reviewing Codex results.
- Interpreting errors when implementation is unclear.
- Deciding the next milestone.
- Writing the final task specification for Codex.

## Use Codex for

- Reading the current repository.
- Editing multiple project files.
- Installing or updating dependencies.
- Running TypeScript checks, tests, and linting.
- Creating Supabase migrations.
- Refactoring.
- Implementing approved features.
- Showing the exact diff.
- Committing after the user has tested and approved the milestone.

## Do not ask Codex to decide

- The product vision.
- Pricing.
- Clinical claims.
- Security policy.
- Whether to trust client metadata for roles.
- Whether a major dependency should be adopted without review.
- The long-term database model.
- Whether an integration is legally or commercially available.

Bring those decisions back to ChatGPT first.

## Standard feature workflow

### 1. Plan in ChatGPT

Tell ChatGPT:

- What you want to build.
- What currently works.
- What changed since the last milestone.
- Any errors or screenshots.

ChatGPT produces:

- Scope.
- Architecture.
- Acceptance criteria.
- Security requirements.
- A precise Codex prompt.

### 2. Implement in Codex

Open the Vantage repository in Codex.

Paste only the approved Codex prompt.

Allow Codex to:

- Inspect the repo.
- Explain its implementation plan.
- Make changes.
- Run checks.

Do not approve unrelated large changes.

### 3. Test locally

Run Vantage on the iPhone.

Test every acceptance criterion.

Do not commit merely because the code compiles.

### 4. Review in ChatGPT

Return to ChatGPT with:

- Codex summary.
- Files changed.
- Test results.
- Errors.
- Any behavior that felt wrong.

ChatGPT reviews the result and decides whether to patch or commit.

### 5. Commit

Ask Codex to commit only after testing passes.

Use one milestone-focused commit.

Example:

`Build database foundation with organization RLS`

### 6. Push

Push to `origin/main` unless a branch workflow is introduced later.

## Codex guardrails

Every Codex task should include:

- Inspect the repository before editing.
- Preserve Expo SDK 54 compatibility.
- Do not expose secrets.
- Do not commit `.env.local`.
- Do not weaken RLS.
- Do not trust user-editable metadata for authorization.
- Avoid unnecessary dependencies.
- Run TypeScript checks.
- Summarize files changed.
- Do not commit until instructed.

## When to stop Codex and return to ChatGPT

Stop and ask ChatGPT when:

- Codex proposes a new major dependency.
- A migration changes authorization behavior.
- An RLS policy is unclear.
- A clinical metric or score is being defined.
- A third-party integration requires credentials or commercial access.
- The task expands beyond the agreed scope.
- Codex cannot explain an error confidently.
- A change could affect existing user data.
