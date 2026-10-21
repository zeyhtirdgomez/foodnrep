import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../firebase";
import "../css/Navbar.css";
const Navbar = () => {
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState("");

    const handleLogout = async () => {
        setLogoutError("");

        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            setLogoutError(error.message || "Could not sign out. Please try again.");
        }
    };

    return (
        <nav className="navbar" aria-label="Main navigation">
            <div className="navbar-brand">
                <Link to="/dashboard">
                    <span className="brand-mark" aria-hidden="true">f</span>
                    <span>food<span className="brand-accent">n</span>rep</span>
                </Link>
            </div>

            <div className="navbar-links">
                <NavLink to="/dashboard">Overview</NavLink>
                <NavLink to="/workout">Discover</NavLink>
                <NavLink to="/exercises">Movement</NavLink>
                <NavLink to="/foods">Food journal</NavLink>
                <button onClick={handleLogout}>
                    Sign out
                </button>
            </div>
            {logoutError && <span role="alert">{logoutError}</span>}
        </nav>
    );
};

export default Navbar;