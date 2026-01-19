import { Link, NavLink, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const location = useLocation();

    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
                setCategories(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <header className="header-styled">
            <div className="top-row">
                <div className="logo-section">
                    <Link to="/" className="logo-link">
                        BlogFusion <span className="logo-dot">.</span>
                    </Link>
                </div>

                {/* Right Section */}
                <div className="right-section">
                    {/* User */}
                    <div className="user-menu group relative">
                        {currentUser ? (
                            <div className="user-info">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
                                    alt="user"
                                    className="user-avatar"
                                />
                                <span className="user-name">Hello, {currentUser.username}</span>
                                <button onClick={logout} className="logout-header-btn">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="login-btn">
                                <span className="icon-user">👤</span>
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    <div className="write-btn-container">
                        <Link to="/write" className="write-btn">Write</Link>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="bottom-nav">
                <div className="nav-container">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive || location.pathname === '/' && !location.search ? "active-link" : ""}
                                end
                            >
                                HOME
                            </NavLink>
                        </li>
                        {categories.map((cat) => (
                            <li className="nav-item" key={cat._id}>
                                <NavLink
                                    to={`/category/${cat.name}`}
                                    className={({ isActive }) => isActive ? "active-link" : ""}
                                >
                                    {cat.name.toUpperCase()}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
