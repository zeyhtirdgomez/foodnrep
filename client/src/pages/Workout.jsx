/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import WorkoutCard from "../components/WorkoutCard";

import "../css/Workout.css";

const Workout = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [type, setType] = useState("");
  const [muscle, setMuscle] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exerciseTypes = [
    "cardio",
    "olympic_weightlifting",
    "plyometrics",
    "powerlifting",
    "strength",
    "stretching",
    "strongman",
  ];

  const muscles = [
    "abdominals",
    "abductors",
    "adductors",
    "biceps",
    "calves",
    "chest",
    "forearms",
    "glutes",
    "hamstrings",
    "lats",
    "lower_back",
    "middle_back",
    "neck",
    "quadriceps",
    "traps",
    "triceps",
  ];

  const difficulties = [
    "beginner",
    "intermediate",
    "expert",
  ];

  const getWorkouts = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem('token');

      const response = await axios.get(`${BACKEND_URL}/api/workout`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });

      setWorkouts(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load exercises.");
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkouts();
  }, []);

  const handleSearch = () => {
    const filters = {};

    if (type) {
      filters.type = type;
    }

    if (muscle) {
      filters.muscle = muscle;
    }

    if (difficulty) {
      filters.difficulty = difficulty;
    }

    getWorkouts(filters);
  };

  const handleReset = () => {
    setType("");
    setMuscle("");
    setDifficulty("");

    getWorkouts();
  };

  const formatText = (text) => {
    if (!text) return "";

    return text
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="workout-page">
      <Navbar />

      <main className="workout-container">

        {/* Header */}
        <section className="workout-header">
          <span className="workout-label">
            WORKOUT LIBRARY
          </span>

          <h1>Find Your Workout</h1>

          <p>
            Explore exercises based on your preferred
            exercise type, target muscle, and difficulty.
          </p>
        </section>

        <section className="workout-filters">

          <div className="filter-group">
            <label htmlFor="type">
              Exercise Type
            </label>

            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">
                All Exercise Types
              </option>

              {exerciseTypes.map((exerciseType) => (
                <option
                  key={exerciseType}
                  value={exerciseType}
                >
                  {formatText(exerciseType)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="muscle">
              Target Muscle
            </label>

            <select
              id="muscle"
              value={muscle}
              onChange={(e) => setMuscle(e.target.value)}
            >
              <option value="">
                All Muscles
              </option>

              {muscles.map((muscleName) => (
                <option
                  key={muscleName}
                  value={muscleName}
                >
                  {formatText(muscleName)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="difficulty">
              Difficulty
            </label>

            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">
                All Difficulty Levels
              </option>

              {difficulties.map((level) => (
                <option
                  key={level}
                  value={level}
                >
                  {formatText(level)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button
              type="button"
              className="search-button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Loading..." : "Find Workouts"}
            </button>

            <button
              type="button"
              className="reset-button"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          </div>

        </section>

        <section className="workout-results">

          <div className="results-header">
            <div>
              <span className="results-label">
                RESULTS
              </span>

              <h2>Exercises</h2>
            </div>

            {!loading && !error && (
              <span className="result-count">
                {workouts.length}{" "}
                {workouts.length === 1
                  ? "exercise"
                  : "exercises"}
              </span>
            )}
          </div>

          {error && (
            <div className="workout-error">
              {error}
            </div>
          )}

          {loading && (
            <div className="workout-status">
              Loading exercises...
            </div>
          )}

          {!loading && !error && workouts.length === 0 && (
            <div className="workout-status">
              No exercises found for the selected filters.
            </div>
          )}

          {!loading && !error && workouts.length > 0 && (
            <div className="workout-grid">
              {workouts.map((workout, index) => (
                <WorkoutCard
                  key={`${workout.name}-${index}`}
                  workout={workout}
                />
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default Workout;