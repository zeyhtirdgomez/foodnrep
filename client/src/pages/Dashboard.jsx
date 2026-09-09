/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import Navbar from "../components/Navbar";
import '../css/Dashboard.css'

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    const [exerciseCount, setExerciseCount] = useState(0);
    const [totalCalories, setTotalCalories] = useState(0);

    const [monthlyData, setMonthlyData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [foodsResponse, exercisesResponse] =
                await Promise.all([
                    axios.get(
                        `${BACKEND_URL}/api/foods`,
                        config
                    ),

                    axios.get(
                        `${BACKEND_URL}/api/exercises`,
                        config
                    )
                ]);

            const foods = foodsResponse.data;
            const exercises = exercisesResponse.data;

            setExerciseCount(exercises.length);

            const calories = foods.reduce(
                (total, food) => total + food.calories,
                0
            );

            setTotalCalories(calories);

        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthlyActivity = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${BACKEND_URL}/api/dashboard/monthly`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMonthlyData(response.data);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load monthly activity."
            );
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchDashboardData();
        fetchMonthlyActivity();
    }, [location.pathname]);

    return (
        <div className="dashboard">

            <Navbar />

            <main className="dashboard-content">

                <h1>Dashboard</h1>

                {error && (
                    <p className="error">{error}</p>
                )}

                <section className="summary-cards">

                    <div className="summary-card">
                        <h2>Total Exercise Today</h2>

                        <p>
                            {loading ? "..." : exerciseCount}
                        </p>

                        <span>exercises</span>
                    </div>

                    <div className="summary-card">
                        <h2>Total Calories Today</h2>

                        <p>
                            {loading
                                ? "..."
                                : Math.round(totalCalories)}
                        </p>

                        <span>kcal</span>
                    </div>

                </section>

                <section className="monthly-activity">

                    <h2>Monthly Activity</h2>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="date"
                                    label={{
                                        value: "Day",
                                        position: "insideBottom",
                                        offset: -5
                                    }}
                                />

                                <YAxis
                                    allowDecimals={false}
                                />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="exercises"
                                    name="Exercises"
                                    stroke="#0F2645"
                                />

                                <Line
                                    type="monotone"
                                    dataKey="foods"
                                    name="Food Records"
                                    stroke="#c22586"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                </section>

            </main>

        </div>
    );
};

export default Dashboard;