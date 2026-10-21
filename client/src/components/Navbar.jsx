import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../firebase";
import "../css/Navbar.css";
const Navbar = () => {
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const menuToggleRef = useRef(null);

    useEffect(() => {
        if (!isMenuOpen) return undefined;

        const handlePointerDown = (event) => {
            if (
                !menuRef.current?.contains(event.target) &&
                !menuToggleRef.current?.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
                menuToggleRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);

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

            <button
                ref={menuToggleRef}
                className={`navbar-menu-toggle${isMenuOpen ? " is-open" : ""}`}
                type="button"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="navbar-links"
                onClick={() => setIsMenuOpen((open) => !open)}
            >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
            </button>

            <div
                ref={menuRef}
                className={`navbar-links${isMenuOpen ? " is-open" : ""}`}
                id="navbar-links"
            >
                <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>Overview</NavLink>
                <NavLink to="/workout" onClick={() => setIsMenuOpen(false)}>Discover</NavLink>
                <NavLink to="/exercises" onClick={() => setIsMenuOpen(false)}>Movement</NavLink>
                <NavLink to="/foods" onClick={() => setIsMenuOpen(false)}>Food journal</NavLink>
                <button type="button" onClick={handleLogout}>
                    Sign out
                </button>
                {logoutError && <span className="navbar-error" role="alert">{logoutError}</span>}
            </div>
        </nav>
    );
};

export default Navbar;