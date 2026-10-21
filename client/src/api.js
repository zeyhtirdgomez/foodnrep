import axios from "axios";
import { signOut } from "firebase/auth";

import { auth } from "./firebase";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});
const profileApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

api.interceptors.request.use(async (config) => {
    const user = auth?.currentUser;

    if (!user) {
        throw new Error("You need to sign in before making this request.");
    }

    config.headers.Authorization = `Bearer ${await user.getIdToken()}`;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (
            error.response?.status === 401 &&
            error.response.data?.code === "UNAUTHENTICATED" &&
            auth?.currentUser
        ) {
            await signOut(auth);
        }

        return Promise.reject(error);
    }
);

export const getFirebaseIdToken = async () => {
    const user = auth?.currentUser;

    if (!user) {
        throw new Error("You need to sign in before making this request.");
    }

    return user.getIdToken();
};

export const createProfile = async (user, profile, forceRefresh = false) => {
    const idToken = await user.getIdToken(forceRefresh);

    return profileApi.post("/api/auth/register", profile, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });
};

export default api;
