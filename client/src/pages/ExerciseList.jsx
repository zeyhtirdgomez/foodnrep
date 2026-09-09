/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ExerciseCard from "../components/ExerciseCard";
import Navbar from "../components/Navbar";

import '../css/ExerciseList.css';
const ExerciseList = () => {
    const navigate = useNavigate();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchExercises = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${VITE_BACKEND_URL}/api/exercises`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setExercises(response.data);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load exercises."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `${VITE_BACKEND_URL}/api/exercises/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setExercises(
                exercises.filter((exercise) => exercise._id !== id)
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete exercise."
            );
        }
    };

    return (
        <div className="exercise-list">
            <Navbar />

            <div className="exercise-list-header">
                <h1>Today's Exercises</h1>

                <button onClick={() => navigate("/exercises/add")}>
                    Add Exercise
                </button>
            </div>

            {loading && <p>Loading exercises...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && exercises.length === 0 && (
                <p>No exercises recorded today.</p>
            )}

            <div className="exercise-list-container">
                {exercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise._id}
                        exercise={exercise}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

        </div>
    );
};

export default ExerciseList;