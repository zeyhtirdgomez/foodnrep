import { Navigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const AuthLoading = () => (
    <main className="auth-loading" role="status">
        Checking your sign-in...
    </main>
);

export const RequireAuth = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <AuthLoading />;
    return user?.emailVerified
        ? children
        : <Navigate
            to="/"
            replace
            state={{
                notice: user
                    ? "Please verify your email address before signing in."
                    : undefined
            }}
        />;
};
