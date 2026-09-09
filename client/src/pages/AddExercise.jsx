import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import '../css/AddExercise.css';
const AddExercise = () => {
    const navigate = useNavigate();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        name: "",
        reps: "",
        sets: "",
        weight: "",
        time: "",
        category: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `${VITE_BACKEND_URL}/api/exercises`,
                {
                    name: formData.name,
                    reps: formData.reps
                        ? Number(formData.reps)
                        : undefined,
                    sets: formData.sets
                        ? Number(formData.sets)
                        : undefined,
                    weight: formData.weight
                        ? Number(formData.weight)
                        : undefined,
                    time: formData.time
                        ? Number(formData.time)
                        : undefined,
                    category: formData.category
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/exercises");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add exercise."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-exercise">
            <Navbar />
            <h1>Add Exercise</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Exercise Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Sets</label>
                    <input
                        type="number"
                        name="sets"
                        value={formData.sets}
                        onChange={handleChange}
                        min="0"
                    />
                </div>

                <div>
                    <label>Reps</label>
                    <input
                        type="number"
                        name="reps"
                        value={formData.reps}
                        onChange={handleChange}
                        min="0"
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
                    <label>Time (minutes)</label>
                    <input
                        type="number"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        min="0"
                    />
                </div>

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select category</option>
                    <option value="arm">Arm</option>
                    <option value="shoulder">Shoulder</option>
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="core">Core</option>
                    <option value="leg">Leg</option>
                </select>

                {error && (
                    <p className="error">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Exercise"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/exercises")}
                >
                    Cancel
                </button>

            </form>

        </div>
    );
};

export default AddExercise;