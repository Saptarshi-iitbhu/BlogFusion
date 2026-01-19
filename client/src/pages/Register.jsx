import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, inputs);
            toast.success("Account Created");
            navigate("/login");
        } catch (err) {
            toast.error(err.response ? err.response.data : "Something went wrong!");
        }
    };

    return (
        <div className="auth">
            <h1>Register</h1>
            <form>
                <input required type="text" placeholder="username" name="username" onChange={handleChange} />
                <input required type="email" placeholder="email" name="email" onChange={handleChange} />
                <input required type="password" placeholder="password" name="password" onChange={handleChange} />
                <button onClick={handleSubmit}>Register</button>
                <span>Do you have an account? <Link to="/login">Login</Link></span>
            </form>
        </div>
    );
};

export default Register;
