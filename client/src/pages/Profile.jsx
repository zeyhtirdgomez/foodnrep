import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    signOut,
    updatePassword
} from "firebase/auth";
import axios from "../api";

import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import "../css/Profile.css";

const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
};

const formatWeight = (weight) => Number(weight).toFixed(1);

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordChanging, setPasswordChanging] = useState(false);
    const [accountActionLoading, setAccountActionLoading] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deletePassword, setDeletePassword] = useState("");

    useEffect(() => {
        let active = true;

        const fetchProfile = async () => {
            try {
                const response = await axios.get("/api/auth/me");
                if (!active) return;

                setProfile(response.data);
                setWeight(response.data.weight ? String(response.data.weight) : "");
                setHeight(response.data.height ? String(response.data.height) : "");
            } catch (fetchError) {
                if (active) {
                    setError(
                        fetchError.response?.data?.message ||
                        "Could not load your health profile. Please try again."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            active = false;
        };
    }, []);

    const weightValue = weight === "" ? 0 : Number(weight);
    const heightValue = height === "" ? 0 : Number(height);
    const hasMeasurements =
        Number.isFinite(weightValue) &&
        Number.isFinite(heightValue) &&
        weightValue > 0 &&
        heightValue > 0;
    const calculatedBmi = hasMeasurements
        ? weightValue / ((heightValue / 100) ** 2)
        : null;
    const bmi = Number.isFinite(calculatedBmi) ? calculatedBmi : null;
    const calculatedMinimumWeight = 18.5 * (heightValue / 100) ** 2;
    const calculatedMaximumWeight = 24.9 * (heightValue / 100) ** 2;
    const healthyWeightRange = heightValue > 0 &&
        Number.isFinite(calculatedMinimumWeight) &&
        Number.isFinite(calculatedMaximumWeight)
        ? {
            minimum: calculatedMinimumWeight,
            maximum: calculatedMaximumWeight
        }
        : null;
    const suggestedWeight = healthyWeightRange
        ? healthyWeightRange.minimum +
            (healthyWeightRange.maximum - healthyWeightRange.minimum) / 2
        : null;

    const handleCancel = () => {
        setWeight(profile.weight ? String(profile.weight) : "");
        setHeight(profile.height ? String(profile.height) : "");
        setError("");
        setNotice("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");
        setSaving(true);

        try {
            const response = await axios.patch("/api/auth/", {
                weight: weightValue,
                height: heightValue
            });
            setProfile(response.data.user);
            setWeight(response.data.user.weight ? String(response.data.user.weight) : "");
            setHeight(response.data.user.height ? String(response.data.user.height) : "");
            setNotice("Your health profile has been updated.");
        } catch (saveError) {
            setError(
                saveError.response?.data?.message ||
                "Could not save your health profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");

        if (newPassword !== confirmPassword) {
            setError("The new passwords do not match.");
            return;
        }

        const currentUser = auth?.currentUser;
        if (!currentUser?.email) {
            setError("Could not verify your account. Please sign in again.");
            return;
        }

        setPasswordChanging(true);
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setNotice("Your password has been changed.");
        } catch (passwordError) {
            setError(
                passwordError.code === "auth/requires-recent-login"
                    ? "Please sign in again before changing your password."
                    : passwordError.message || "Could not change your password. Please try again."
            );
        } finally {
            setPasswordChanging(false);
        }
    };

    const handleDeactivate = async () => {
        if (!window.confirm("Deactivate your account? Your data will be kept, and you can reactivate by signing in again.")) {
            return;
        }

        setError("");
        setNotice("");
        setAccountActionLoading(true);
        try {
            await axios.post("/api/auth/deactivate");
            await signOut(auth);
            navigate("/", {
                state: { notice: "Your account is deactivated. Sign in when you are ready to reactivate it." }
            });
        } catch (deactivationError) {
            setError(
                deactivationError.response?.data?.message ||
                deactivationError.message ||
                "Could not deactivate your account. Please try again."
            );
        } finally {
            setAccountActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmation !== "DELETE") return;

        setError("");
        setNotice("");
        setAccountActionLoading(true);
        try {
            const currentUser = auth?.currentUser;
            if (!currentUser?.email) {
                throw new Error("Could not verify your account. Please sign in again.");
            }
            const credential = EmailAuthProvider.credential(currentUser.email, deletePassword);
            await reauthenticateWithCredential(currentUser, credential);
            await currentUser.getIdToken(true);
            await axios.delete("/api/auth");
            await signOut(auth);
            navigate("/", { state: { notice: "Your account and its data have been permanently deleted." } });
        } catch (deletionError) {
            setError(
                deletionError.response?.data?.message ||
                deletionError.message ||
                "Could not delete your account. Please try again."
            );
        } finally {
            setAccountActionLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <Navbar />

            <main className="profile-container">
                <header className="profile-heading">
                    <span className="profile-eyebrow">YOUR WELLNESS, YOUR WAY</span>
                    <h1>Health profile</h1>
                    <p>Keep your measurements up to date and see how they relate to your BMI.</p>
                </header>

                {error && <p className="profile-message profile-error" role="alert">{error}</p>}
                {notice && <p className="profile-message profile-success" role="status">{notice}</p>}

                {loading ? (
                    <p className="profile-loading" role="status">Loading your profile...</p>
                ) : profile ? (
                    <div className="profile-layout">
                        <section className="profile-card profile-details">
                            <div className="profile-card-heading">
                                <div>
                                    <span className="profile-eyebrow">ABOUT YOU</span>
                                    <h2>Measurements</h2>
                                </div>
                                <span className="profile-avatar" aria-hidden="true">
                                    {profile.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                            </div>

                            <p className="profile-name">
                                <span>Name</span>
                                <strong>{profile.name}</strong>
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="profile-fields">
                                    <label htmlFor="profile-weight">
                                        Weight <span>(kg)</span>
                                        <input
                                            id="profile-weight"
                                            name="weight"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={weight}
                                            onChange={(event) => setWeight(event.target.value)}
                                            disabled={saving}
                                        />
                                    </label>
                                    <label htmlFor="profile-height">
                                        Height <span>(cm)</span>
                                        <input
                                            id="profile-height"
                                            name="height"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={height}
                                            onChange={(event) => setHeight(event.target.value)}
                                            disabled={saving}
                                        />
                                    </label>
                                </div>

                                <p className="profile-field-hint">
                                    Enter 0 or leave a measurement blank if you do not want to set it.
                                </p>
                                <div className="profile-form-actions">
                                    <button className="profile-save" type="submit" disabled={saving}>
                                        {saving ? "Saving..." : "Save changes"}
                                    </button>
                                    <button
                                        className="profile-cancel"
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </section>

                        <section className="profile-card profile-bmi-card" aria-live="polite">
                            <span className="profile-eyebrow">BODY MASS INDEX</span>
                            {bmi === null ? (
                                <>
                                    <p className="profile-bmi-value">—</p>
                                    <p className="profile-bmi-category">Add height and weight to calculate BMI.</p>
                                </>
                            ) : (
                                <>
                                    <p className="profile-bmi-value">{bmi.toFixed(1)}</p>
                                    <p className={`profile-bmi-category bmi-${getBmiCategory(bmi).toLowerCase()}`}>
                                        {getBmiCategory(bmi)}
                                    </p>
                                </>
                            )}
                            <p className="profile-bmi-note">
                                BMI is calculated from your height and weight.
                            </p>
                        </section>

                        <section className="profile-card profile-target-card">
                            <div>
                                <span className="profile-eyebrow">A REFERENCE FOR YOUR HEIGHT</span>
                                <h2>Normal BMI weight target</h2>
                            </div>
                            {healthyWeightRange ? (
                                <>
                                    <p className="profile-target-range">
                                        {formatWeight(healthyWeightRange.minimum)}–{formatWeight(healthyWeightRange.maximum)}
                                        <span> kg healthy range</span>
                                    </p>
                                    <p className="profile-suggested-target">
                                        Suggested target <strong>{formatWeight(suggestedWeight)} kg</strong>
                                    </p>
                                </>
                            ) : (
                                <p className="profile-target-empty">
                                    Add your height to see an estimated healthy weight range and target.
                                </p>
                            )}
                            <p className="profile-target-note">
                                Based on the adult BMI range of 18.5–24.9. BMI is a general screening measure,
                                not a diagnosis or a substitute for professional advice.
                            </p>
                        </section>

                        <section className="profile-card profile-account-card">
                            <div>
                                <span className="profile-eyebrow">ACCOUNT SECURITY</span>
                                <h2>Change password</h2>
                            </div>
                            <form onSubmit={handlePasswordChange}>
                                <div className="profile-fields">
                                    <label htmlFor="current-password">
                                        Current password
                                        <input
                                            id="current-password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={currentPassword}
                                            onChange={(event) => setCurrentPassword(event.target.value)}
                                            required
                                            disabled={passwordChanging}
                                        />
                                    </label>
                                    <label htmlFor="new-password">
                                        New password
                                        <input
                                            id="new-password"
                                            type="password"
                                            autoComplete="new-password"
                                            minLength="6"
                                            value={newPassword}
                                            onChange={(event) => setNewPassword(event.target.value)}
                                            required
                                            disabled={passwordChanging}
                                        />
                                    </label>
                                    <label htmlFor="confirm-password">
                                        Confirm new password
                                        <input
                                            id="confirm-password"
                                            type="password"
                                            autoComplete="new-password"
                                            minLength="6"
                                            value={confirmPassword}
                                            onChange={(event) => setConfirmPassword(event.target.value)}
                                            required
                                            disabled={passwordChanging}
                                        />
                                    </label>
                                </div>
                                <p className="profile-field-hint">
                                    Confirm your current password to change it. Passwords must be at least 6 characters.
                                </p>
                                <div className="profile-form-actions">
                                    <button className="profile-save" type="submit" disabled={passwordChanging}>
                                        {passwordChanging ? "Changing..." : "Change password"}
                                    </button>
                                </div>
                            </form>

                            <div className="profile-account-actions">
                                <div>
                                    <h2>Deactivate account</h2>
                                    <p>Your profile and journal entries will be kept. You can reactivate by signing in.</p>
                                    <button
                                        className="profile-cancel"
                                        type="button"
                                        onClick={handleDeactivate}
                                        disabled={accountActionLoading}
                                    >
                                        {accountActionLoading ? "Please wait..." : "Deactivate account"}
                                    </button>
                                </div>
                                <div className="profile-danger-zone">
                                    <h2>Delete account</h2>
                                    <p>This permanently deletes your account and food and exercise records. This cannot be undone.</p>
                                    <label htmlFor="delete-confirmation">
                                        Type DELETE to confirm
                                        <input
                                            id="delete-confirmation"
                                            type="text"
                                            value={deleteConfirmation}
                                            onChange={(event) => setDeleteConfirmation(event.target.value)}
                                            disabled={accountActionLoading}
                                        />
                                    </label>
                                    <label htmlFor="delete-password">
                                        Confirm your current password
                                        <input
                                            id="delete-password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={deletePassword}
                                            onChange={(event) => setDeletePassword(event.target.value)}
                                            required
                                            disabled={accountActionLoading}
                                        />
                                    </label>
                                    <button
                                        className="profile-delete"
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={accountActionLoading || deleteConfirmation !== "DELETE" || !deletePassword}
                                    >
                                        {accountActionLoading ? "Deleting..." : "Permanently delete account"}
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : null}
            </main>
        </div>
    );
};

export default Profile;
