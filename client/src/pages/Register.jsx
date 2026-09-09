import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import '../css/Register.css';

const Register = () => {
    const navigate = useNavigate();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    
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
            await axios.post(
                `${VITE_BACKEND_URL}/api/auth/register`,
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    weight: Number(formData.weight),
                    height: Number(formData.height)
                }
            );

            navigate("/");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container pages">
            <h1>Register</h1>

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

                {error && (
                    <p className="error">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>

            </form>

            <p>
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                >
                    Login
                </button>
            </p>
        </div>
    );
};

export default Register;