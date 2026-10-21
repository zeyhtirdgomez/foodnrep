import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    sendEmailVerification,
    signOut,
    signInWithEmailAndPassword
} from "firebase/auth";

import { auth, isFirebaseConfigured } from "../firebase";
import { createProfile } from "../api";
import "../css/Login.css";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verificationUser, setVerificationUser] = useState(null);
    const [notice, setNotice] = useState(location.state?.notice || "");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setNotice("");
        setVerificationUser(null);
        setLoading(true);

        try {
            const credential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await credential.user.reload();

            if (!credential.user.emailVerified) {
                let verificationMessage =
                    "Your email is not verified. We sent another verification link; check your inbox before signing in.";

                try {
                    await sendEmailVerification(credential.user);
                } catch (verificationError) {
                    verificationMessage =
                        `Your email is not verified. Please use the verification link we previously sent. ` +
                        `We could not resend it: ${verificationError.message}`;
                }

                await signOut(auth);
                setError(verificationMessage);
                return;
            }

            await createProfile(credential.user, {
                name: credential.user.displayName || formData.email.split("@")[0]
            }, true);
            navigate("/dashboard");

        } catch (submitError) {
            if (submitError.response?.data?.code === "EMAIL_VERIFICATION_REQUIRED") {
                setVerificationUser(auth.currentUser);
                setError(submitError.response.data.message);
            } else {
                setError(
                    submitError.response?.data?.message ||
                    "Sign-in failed. Check your email and password, then try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!verificationUser) return;

        setError("");
        setNotice("");
        setLoading(true);

        try {
            await sendEmailVerification(verificationUser);
            setNotice("Verification email sent. Verify your address, then sign in again.");
        } catch (verificationError) {
            setError(
                verificationError.message ||
                "Could not send the verification email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <span className="auth-eyebrow">FOODNREP WELLNESS JOURNAL</span>
            <h1>Welcome back</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {!isFirebaseConfigured && (
                    <p className="error" role="alert">
                        Firebase is not configured. Add the VITE_FIREBASE_* values to the client environment.
                    </p>
                )}

                {error && (
                    <p className="error" role="alert">{error}</p>
                )}

                {notice && (
                    <p className="auth-notice" role="status">{notice}</p>
                )}

                <button type="submit" disabled={loading || !isFirebaseConfigured}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

            </form>

            {verificationUser && (
                <button
                    className="verification-button"
                    type="button"
                    onClick={handleResendVerification}
                    disabled={loading}
                >
                    Resend verification email
                </button>
            )}

            <p>
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/register")}
                >
                    Create account
                </button>
            </p>
        </div>
    );
};

export default Login;