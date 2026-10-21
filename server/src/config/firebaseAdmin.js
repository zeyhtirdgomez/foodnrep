import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseApp = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault()
    });

const firebaseAdminAuth = getAuth(firebaseApp);

export default firebaseAdminAuth;
