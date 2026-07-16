# Authentication hardening patch

This patch:

- Removes public provider registration.
- Forces all in-app sign-ups to `patient`.
- Keeps provider routing available for administrator-provisioned accounts.
- Adds invite-only provider messaging.
- Replaces the implicit localhost email redirect with a placeholder production redirect.

## Important Supabase dashboard step

In Supabase:

1. Open **Authentication → URL Configuration**.
2. Set **Site URL** to:

   `https://vantage.app`

3. Add this redirect URL:

   `https://vantage.app/auth/confirmed`

This is a placeholder until Vantage has a production domain or deep-link route. Email confirmation will still work, but the browser may show an unavailable page until that URL exists.

For local feasibility testing, the cleanest option is to temporarily disable **Confirm email** under **Authentication → Providers → Email**, then re-enable it before beta testing.
