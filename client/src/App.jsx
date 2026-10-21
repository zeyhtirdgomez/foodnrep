import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import { RequireAuth } from "./components/AuthRoutes";
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
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

                    <Route path="/exercises" element={<RequireAuth><ExerciseList /></RequireAuth>} />
                    <Route path="/exercises/add" element={<RequireAuth><AddExercise /></RequireAuth>} />

                    <Route path="/foods" element={<RequireAuth><FoodList /></RequireAuth>} />
                    <Route path="/foods/manual-add" element={<RequireAuth><ManualAddFood /></RequireAuth>} />
                    <Route path="/foods/auto-add" element={<RequireAuth><AutoAddFood /></RequireAuth>} />

                    <Route path="/workout" element={<RequireAuth><Workout /></RequireAuth>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;