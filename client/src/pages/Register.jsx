import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    updateProfile
} from "firebase/auth";

import { auth, isFirebaseConfigured } from "../firebase";
import "../css/Register.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        weight: "",
        height: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const credential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            await updateProfile(credential.user, { displayName: formData.name });
            let verificationNotice =
                "Your account is created. Verify your email from the link we sent, then sign in.";

            try {
                await sendEmailVerification(credential.user);
            } catch (verificationError) {
                verificationNotice =
                    `Your account is created, but we could not send a verification email: ${verificationError.message}`;
            }
            await signOut(auth);
            navigate("/", { state: { notice: verificationNotice } });

        } catch (submitError) {
            setError(
                submitError.response?.data?.message ||
                submitError.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container pages">
            <span className="auth-eyebrow">A FRESH START</span>
            <h1>Create your account</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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

                <div>
                    <label>Weight (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                    />
                </div>

                <div>
                    <label>Height (cm)</label>
                    <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
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

                <button type="submit" disabled={loading || !isFirebaseConfigured}>
                    {loading ? "Creating account..." : "Create account"}
                </button>

            </form>

            <p>
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                >
                    Sign in
                </button>
            </p>
        </div>
    );
};

export default Register;