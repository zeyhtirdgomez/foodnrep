/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios, { getFirebaseIdToken } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import "../css/Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const token = auth?.currentUser;

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
                navigate("/");
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
            const token = await getFirebaseIdToken();

            const response = await axios.get(
                `${BACKEND_URL}/api/dashboard/monthly`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            
            if (Array.isArray(response.data))
                setMonthlyData(response.data);
            else if (response.data && Array.isArray(response.data.data))
                setMonthlyData(response.data.data);
            else 
                setMonthlyData([]);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load monthly activity."
            );
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        fetchDashboardData();
        fetchMonthlyActivity();
    }, [location.pathname]);

    return (
        <div className="dashboard">
            <Navbar />

            <main className="dashboard-content">
                <header className="dashboard-heading">
                    <div>
                        <span className="eyebrow">YOUR WELLNESS JOURNAL</span>
                        <h1>A little progress, every day.</h1>
                        <p>A gentle snapshot of the habits you have been building.</p>
                    </div>
                    <div className="dashboard-actions">
                        <button type="button" onClick={() => navigate("/foods/manual-add")}>
                            Log food
                        </button>
                        <button type="button" onClick={() => navigate("/exercises/add")}>
                            Add exercise
                        </button>
                    </div>
                </header>

                {error && (
                    <p className="error" role="alert">{error}</p>
                )}

                <section className="summary-cards">
                    <div className="summary-card">
                        <span className="summary-icon" aria-hidden="true">✳</span>
                        <h2>Exercise entries</h2>
                        <p className="summary-value">
                            {loading ? "..." : exerciseCount}
                        </p>
                        <span>logged in your journal</span>
                    </div>

                    <div className="summary-card">
                        <span className="summary-icon summary-icon-food" aria-hidden="true">◌</span>
                        <h2>Calories logged</h2>
                        <p className="summary-value">
                            {loading
                                ? "..."
                                : Math.round(totalCalories)}
                        </p>
                        <span>kcal across your food entries</span>
                    </div>
                </section>

                <section className="monthly-activity">
                    <div className="section-heading">
                        <div>
                            <span className="eyebrow">YOUR MONTH AT A GLANCE</span>
                            <h2>Daily activity</h2>
                            <p>Food and exercise entries, day by day.</p>
                        </div>
                        <span className="month-label">
                            {new Intl.DateTimeFormat(undefined, {
                                month: "long",
                                year: "numeric"
                            }).format(new Date())}
                        </span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={Array.isArray(monthlyData) ? monthlyData : []}
                                margin={{ top: 12, right: 8, left: -18, bottom: 4 }}
                                barGap={5}
                                barCategoryGap="28%"
                            >
                                <CartesianGrid vertical={false} stroke="#e9eee9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#89958a", fontSize: 12 }}
                                    tickMargin={12}
                                    interval={Math.max(0, Math.ceil(monthlyData.length / 8) - 1)}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#89958a", fontSize: 12 }}
                                    width={38}
                                />
                                <Tooltip
                                    cursor={{ fill: "#f1f5ef" }}
                                    contentStyle={{
                                        border: "1px solid #e5ebe3",
                                        borderRadius: 12,
                                        boxShadow: "0 8px 24px rgba(37, 56, 43, 0.08)"
                                    }}
                                    labelFormatter={(day) => `Day ${day}`}
                                />
                                <Legend
                                    verticalAlign="top"
                                    align="right"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ paddingBottom: 18, fontSize: 12 }}
                                />
                                <Bar
                                    dataKey="exercises"
                                    name="Exercise entries"
                                    fill="#66866d"
                                    radius={[5, 5, 0, 0]}
                                />
                                <Bar
                                    dataKey="foods"
                                    name="Food entries"
                                    fill="#d59a70"
                                    radius={[5, 5, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;