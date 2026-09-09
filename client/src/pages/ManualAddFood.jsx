import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import '../css/ManualAddFood.css'
const ManualAddFood = () => {
    const navigate = useNavigate();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        name: "",
        grams: "",
        calories: ""
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
            const token = localStorage.getItem("token");

            await axios.post(
                `${VITE_BACKEND_URL}/api/foods`,
                {
                    name: formData.name,
                    grams: Number(formData.grams),
                    calories: Number(formData.calories)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/foods");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add food."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manual-add-food">
            <Navbar />
            <h1>Manually Add Food</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Food Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Amount (grams)</label>
                    <input
                        type="number"
                        name="grams"
                        value={formData.grams}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        required
                    />
                </div>

                <div>
                    <label>Calories</label>
                    <input
                        type="number"
                        name="calories"
                        value={formData.calories}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        required
                    />
                </div>

                {error && (
                    <p className="error">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Food"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/foods")}
                >
                    Cancel
                </button>

            </form>

        </div>
    );
};

export default ManualAddFood;