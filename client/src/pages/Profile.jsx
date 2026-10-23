import { useEffect, useState } from "react";
import axios from "../api";

import Navbar from "../components/Navbar";
import "../css/Profile.css";

const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
};

const formatWeight = (weight) => Number(weight).toFixed(1);

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

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
                    </div>
                ) : null}
            </main>
        </div>
    );
};

export default Profile;
