# FoodnRep server

## Firebase Admin setup

1. Enable the Email/Password provider in Firebase Authentication.
2. Create a Firebase Admin service-account key in the Firebase project settings.
3. Store the downloaded JSON outside this repository. Do not commit it or send it to the client.
4. Copy `.env.example` to `.env`, set `FIREBASE_PROJECT_ID` to the Firebase project ID and `GOOGLE_APPLICATION_CREDENTIALS` to the JSON file's absolute path, and configure the MongoDB URI and other required environment values.
5. Start the API with `npm run dev`.

The server uses Application Default Credentials through `GOOGLE_APPLICATION_CREDENTIALS` and the explicit `FIREBASE_PROJECT_ID` when verifying Firebase ID tokens with the Admin SDK.

### Render deployment

1. Add the Firebase Admin service-account JSON in the backend Render service under **Environment → Secret Files**. Choose a filename such as `firebase-admin.json`.
2. Set `GOOGLE_APPLICATION_CREDENTIALS` to `/etc/secrets/firebase-admin.json` (using the filename you chose).
3. Set `FIREBASE_PROJECT_ID` to the Firebase project ID (`foodnrep` for this project).
4. Save and redeploy the backend service.

Do not paste the JSON contents into `GOOGLE_APPLICATION_CREDENTIALS`; that variable must be the secret file's runtime path.

Protected endpoints continue to use the MongoDB profile ID internally; the middleware resolves it from the verified Firebase UID.

## Auth API contract

- `POST /api/auth/register` requires `Authorization: Bearer <Firebase ID token>` and accepts profile fields such as `{ "name": "...", "weight": 0, "height": 0 }`.
- A verified Firebase email is required to create a FoodnRep profile or link an existing profile. Existing profile data and logged food/exercises are retained when linking.
- All protected API routes reject ID tokens whose `email_verified` claim is false. Firebase passwords are never sent to the API.
- `GET /api/auth/me`, `PATCH /api/auth`, and `DELETE /api/auth` require a linked FoodnRep profile.
