import { Link, useNavigate } from "react-router-dom";

import '../css/Navbar.css';
const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                <Link to="/dashboard">
                    Calorie Tracker
                </Link>
            </div>

            <div className="navbar-links">

                <Link to="/exercises">
                    Exercises
                </Link>

                <Link to="/foods">
                    Foods
                </Link>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </nav>
    );
};

export default Navbar;