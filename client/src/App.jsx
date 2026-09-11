import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ExerciseList from "./pages/ExerciseList";
import AddExercise from "./pages/AddExercise";

import FoodList from "./pages/FoodList";
import ManualAddFood from "./pages/ManualAddFood";
import AutoAddFood from "./pages/AutoAddFood";

import Workout from "./pages/Workout";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/exercises" element={<ExerciseList />} />
                <Route path="/exercises/add" element={<AddExercise />} />

                <Route path="/foods" element={<FoodList />} />
                <Route path="/foods/manual-add" element={<ManualAddFood />} />
                <Route path="/foods/auto-add" element={<AutoAddFood />} />

                <Route path="/workout" element={<Workout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;