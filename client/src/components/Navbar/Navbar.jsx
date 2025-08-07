//components/Navbar/Navbar.jsx

import './navbar.css'
import { useState, useContext } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../authContext"
import axios from "axios";

const Navbar = () => {

    const navigate = useNavigate()

    const { user, dispatch } = useContext(AuthContext)
    
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            // Call server logout endpoint if it exists
            await axios.post("https://shapesync-5rkn.onrender.com/api/auth/logout", {}, {
                withCredentials: true
            });
        } catch (error) {
            console.log("Logout error:", error);
        } finally {
            // Clear local storage and context
            localStorage.removeItem("user");
            dispatch({ type: "LOGOUT" });
            navigate("/");
        }
    }

    return (
        <div className='navContainer'>
            <Link to="/home">
                <p className='navLogo'>ShapeSync</p>
            </Link>

            <input type="checkbox" id='menu-bar' />
            <label htmlFor="menu-bar">
                <FontAwesomeIcon icon={faBars} className="icon" /></label>
            <nav className='navbar'>
                <ul>
                    <Link to="/routines">
                        <li><p>Routine</p></li>
                    </Link>
                    <Link to="/meals">
                        <li><p>Meal</p></li>
                    </Link>
                    <Link to="/entries">
                        <li><p>Entries</p></li>
                    </Link>
                    {user ? (<>
                        <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                            <p>Logout</p>
                        </li>
                        <Link to={`/user/${user._id}`}>
                            <li>
                                <div className="profilePicture">
                                    <img src={user.profilePicture || 
                                    "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="" />
                                </div>
                            </li>
                            <li id="usernamename"><p>{user.username}</p></li>
                        </Link>
                    </>
                    )
                        :
                        (
                            <>
                                <Link to="/register">
                                    <li><p>Register</p></li>
                                </Link>
                                <Link to="/login">
                                    <li><p>Login</p></li>
                                </Link>
                            </>
                        )}
                </ul>
            </nav>
        </div >
    )
}

export default Navbar
