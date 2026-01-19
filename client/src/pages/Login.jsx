import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, inputs);
            login(res.data);
            toast.success("Login Successful");
            navigate("/");
        } catch (err) {
            toast.error(err.response ? err.response.data : "Something went wrong!");
        }
    };

    return (
        <div className="auth">
            <h1>Login</h1>
            <form>
                <input required type="text" placeholder="email" name="email" onChange={handleChange} />
                <input required type="password" placeholder="password" name="password" onChange={handleChange} />
                <button onClick={handleSubmit}>Login</button>
                <span>Don't you have an account? <Link to="/register">Register</Link></span>
            </form>
        </div>
    );
};

export default Login;
