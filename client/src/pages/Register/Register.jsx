//pages/Register/Register.jsx

import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./register.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [info, setInfo] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!info.username.trim()) {
            newErrors.username = "Username is required";
        } else if (info.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }
        
        if (!info.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(info.email)) {
            newErrors.email = "Please enter a valid email";
        }
        
        if (!info.password) {
            newErrors.password = "Password is required";
        } else if (info.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        
        if (!info.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (info.password !== info.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
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

        try {
            const userData = {
                username: info.username,
                email: info.email,
                password: info.password
            };

            // If file is selected, you can handle image upload here
            // For now, we'll just register without image
            if (file) {
                // TODO: Implement image upload to Cloudinary or other service
                console.log("Image upload not implemented yet");
            }

            await axios.post("http://localhost:7700/api/auth/register", userData);
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            let errorMessage = "Registration failed. Please try again.";
            
            if (err.response && err.response.data) {
                if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                }
            }
            
            alert(errorMessage);
            console.error("Registration error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register">
            <Navbar />
            <div className="registerCard">
                <div className="center">
                    <h1>Join Us</h1>

                    <form onSubmit={handleClick}>
                        <div className="image">
                            <img
                                src={
                                    file
                                        ? URL.createObjectURL(file)
                                        : "https://icon-library.com/images/no-image-icon//no-image-icon-0.jpg"
                                }
                                alt=""
                                height="100px"
                            />

                            <div className="txt_field_img">
                                <label htmlFor="file">
                                    Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <div className="formInput">
                            <div className="txt_field">
                                <input
                                    type="text"
                                    placeholder="username"
                                    name="username"
                                    value={info.username}
                                    onChange={handleChange}
                                    id="username"
                                    className={errors.username ? 'error' : ''}
                                    required
                                />
                                {errors.username && <span className="error-message">{errors.username}</span>}
                            </div>
                            <div className="txt_field">
                                <input
                                    type="email"
                                    placeholder="email"
                                    name="email"
                                    value={info.email}
                                    onChange={handleChange}
                                    id="email"
                                    className={errors.email ? 'error' : ''}
                                    required
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                            <div className="txt_field">
                                <input
                                    type="password"
                                    placeholder="password"
                                    name="password"
                                    value={info.password}
                                    onChange={handleChange}
                                    id="password"
                                    className={errors.password ? 'error' : ''}
                                    required
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>
                            <div className="txt_field">
                                <input
                                    type="password"
                                    placeholder="confirm password"
                                    name="confirmPassword"
                                    value={info.confirmPassword}
                                    onChange={handleChange}
                                    id="confirmPassword"
                                    className={errors.confirmPassword ? 'error' : ''}
                                    required
                                />
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>
                        </div>
                        <div className="login_button">
                            <button 
                                className="button" 
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </button>
                        </div>
                        <div className="signup_link">
                            <p>
                                Already Registered? <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Register;