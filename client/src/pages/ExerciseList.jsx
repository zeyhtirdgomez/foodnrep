/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios, { getFirebaseIdToken } from "../api";
import { useNavigate } from "react-router-dom";

import ExerciseCard from "../components/ExerciseCard";
import Navbar from "../components/Navbar";

import '../css/ExerciseList.css';
const ExerciseList = () => {
    const navigate = useNavigate();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [exercises, setExercises] = useState([]);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchExercises = async (date = "") => {
        try {
            setLoading(true);
            setError("");

            const token = await getFirebaseIdToken();

            const url = 
                date === "" ? `${VITE_BACKEND_URL}/api/exercises`: 
                `${VITE_BACKEND_URL}/api/exercises/?date=${date}`;

            
            const response = await axios.get(
                url,
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
            const token = await getFirebaseIdToken();

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
                
                <div className='header'>
                    <div>
                        <h1>Move in your own way.</h1>
                    </div>
                    <div>
                        <label className="visually-hidden" htmlFor="exercise-date">Filter exercise by date</label>
                        <input type="date"
                            id="exercise-date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                        <button onClick={() => fetchExercises(date)}>Show date</button>
                    </div>     
                </div>

                <button onClick={() => navigate("/exercises/add")}>
                    <span aria-hidden="true">+</span> Add exercise
                </button>
            </div>

            {loading && <p>Loading exercises...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && exercises.length === 0 && (
                <p>No exercises recorded.</p>
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