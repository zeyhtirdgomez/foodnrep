/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import FoodCard from "../components/FoodCard";
import Navbar from "../components/Navbar";

import '../css/FoodList.css'
const FoodList = () => {
    const navigate = useNavigate();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [foods, setFoods] = useState([]);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchFoods = async (date = "") => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const url = date === "" ?
                `${VITE_BACKEND_URL}/api/foods`:
                `${VITE_BACKEND_URL}/api/foods/?date=${date}`
            const response = await axios.get(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFoods(response.data);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load foods."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `${VITE_BACKEND_URL}/api/foods/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFoods(
                foods.filter((food) => food._id !== id)
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete food."
            );
        }
    };

    return (
        <div className="food-list">
            <Navbar />

            <div className="food-list-header">
                
                <div className='header'>
                    <h1>Today's Food</h1>
                    <div>
                        <input type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                        <button onClick={() => fetchFoods(date)} />
                    </div>   
                </div>
            </div>

            <div className="food-add-options">

                <button
                    onClick={() => navigate("/foods/manual-add")}
                >
                    Manual Add
                </button>

                <button
                    onClick={() => navigate("/foods/auto-add")}
                >
                    Auto Add
                </button>

            </div>

            {loading && <p>Loading foods...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && foods.length === 0 && (
                <p>No food recorded.</p>
            )}

            <div className="food-list-container">
                {foods.map((food) => (
                    <FoodCard
                        key={food._id}
                        food={food}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

        </div>
    );
};

export default FoodList;