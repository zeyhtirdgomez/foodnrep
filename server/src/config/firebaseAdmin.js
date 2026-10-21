import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseApp = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
        projectId:
            process.env.FIREBASE_PROJECT_ID ||
            process.env.GOOGLE_CLOUD_PROJECT ||
            process.env.GCLOUD_PROJECT
    });

const firebaseAdminAuth = getAuth(firebaseApp);

export default firebaseAdminAuth;
