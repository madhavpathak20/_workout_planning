//pages/Login/Login.jsx

import React from "react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import "./login.css";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../authContext";

function Login() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!credentials.username.trim()) {
            newErrors.username = "Username is required";
        }
        if (!credentials.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
        // Clear error when user starts typing
        if (errors[e.target.id]) {
            setErrors(prev => ({ ...prev, [e.target.id]: "" }));
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        dispatch({ type: "LOGIN_START" });
        
        try {
            const res = await axios.post("http://localhost:7700/api/auth/login", credentials);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
            navigate('/home');
        } catch (err) {
            let errorMessage = "An error occurred while logging in";
            
            if (err.response && err.response.data) {
                if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                }
            }
            
            dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <Navbar />
            <div className="loginCard">
                <div className="center">
                    <h1>Welcome Back!</h1>
                    <form onSubmit={handleClick}>
                        <div className="txt_field">
                            <input
                                type="text"
                                placeholder="username"
                                id="username"
                                value={credentials.username}
                                onChange={handleChange}
                                className={`lInput ${errors.username ? 'error' : ''}`}
                            />
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>
                        <div className="txt_field">
                            <input
                                type="password"
                                placeholder="password"
                                id="password"
                                value={credentials.password}
                                onChange={handleChange}
                                className={`lInput ${errors.password ? 'error' : ''}`}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        <div className="login_button">
                            <button 
                                className="button" 
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                        <div className="signup_link">
                            <p>
                                Not registered? <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;