# FoodnRep client

## Firebase Authentication setup

1. Create or select a Firebase project and add a Web app.
2. In Firebase Console, enable **Authentication → Sign-in method → Email/Password**.
3. Add `localhost` and your deployed client domain to **Authentication → Settings → Authorized domains**.
4. Copy `.env.example` to `.env` in this directory and fill in the Firebase Web app config values and backend URL.
5. Start the client with `npm run dev`.

The Firebase Web config is intended for client-side use. Do not put Firebase Admin service-account credentials in the client or commit them.

## Authentication flow

- Firebase creates and signs in email/password accounts in the browser.
- Users must verify their email before sign-in grants access to the app.
- The client sends the Firebase ID token as a Bearer token to the API. The shared Axios interceptor refreshes the token when needed.
- After Firebase email verification, `POST /api/auth/register` creates the FoodnRep profile or links a matching legacy profile.
- Existing food and exercise records stay attached to their MongoDB user profile when that profile is linked.

For API verification and service-account setup, see [`../server/README.md`](../server/README.md).

## Other commands

- `npm run lint` checks the client.
- `npm run build` creates a production build in `dist`.
