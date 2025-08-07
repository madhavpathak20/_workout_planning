//components/create/CreateRoutine.jsx

import './popUp.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from 'react';
import axios from "axios"
import { AuthContext } from '../../authContext.js';
import { WorkoutType, BodyPart } from "../../data.js"

const CreateRoutine = ({ setOpen }) => {

    const { user } = useContext(AuthContext);
    const [info, setInfo] = useState({
        name: '',
        link: '',
        workout_type: 'none',
        body_part: 'none'
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!info.name.trim()) {
            newErrors.name = "Routine name is required";
        }
        
        if (info.workout_type === 'none') {
            newErrors.workout_type = "Please select a workout type";
        }
        
        if (info.body_part === 'none') {
            newErrors.body_part = "Please select a body part";
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
    }

    const handleClick = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!user?._id) {
            alert("Please login to create a routine");
            return;
        }

        setIsLoading(true);

        const newRoutine = {
            ...info, 
            author: user._id
        }

        try {
            await axios.post("https://shapesync-5rkn.onrender.com/api/routines", newRoutine, {
                withCredentials: true
            });
            setOpen(false);
            alert("Routine created successfully!");
            // Optionally refresh the page or update the parent component
            window.location.reload();
        } catch (err) {
            console.error("Routine creation error:", err);
            let errorMessage = "Failed to create routine. Please try again.";
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="modal">
            <div className="mContainer">

                <FontAwesomeIcon icon={faXmark} className="mClose" onClick={() => setOpen(false)} />

                <div className="mTitle">Create Routine</div>

                <form onSubmit={handleClick}>
                    <div className="formInput">
                        <input
                            className={errors.name ? 'error' : ''}
                            type="text"
                            onChange={handleChange}
                            id="name"
                            value={info.name}
                            placeholder='Enter the Workout Name'
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    
                    <div className="formInput">
                        <input
                            type="text"
                            onChange={handleChange}
                            id="link"
                            value={info.link}
                            placeholder='Add workout link (optional)'
                        />
                    </div>

                    <div className="formInput" id='options'>
                        <label>Choose Workout Type</label>
                        <select 
                            id="workout_type" 
                            onChange={handleChange}
                            value={info.workout_type}
                            className={errors.workout_type ? 'error' : ''}
                        >
                            <option key={0} value="none">-</option>
                            {
                                WorkoutType.map((w, index) => (
                                    <option key={index} value={w}>{w}</option>
                                ))
                            }
                        </select>
                        {errors.workout_type && <span className="error-message">{errors.workout_type}</span>}
                    </div>

                    <div className="formInput" id='options'>
                        <label>Choose Body Part</label>
                        <select 
                            id="body_part" 
                            onChange={handleChange}
                            value={info.body_part}
                            className={errors.body_part ? 'error' : ''}
                        >
                            <option key={0} value="none">-</option>
                            {
                                BodyPart.map((b, index) => (
                                    <option key={index} value={b}>{b}</option>
                                ))
                            }
                        </select>
                        {errors.body_part && <span className="error-message">{errors.body_part}</span>}
                    </div>
                </form>

                <button 
                    className="mButton" 
                    onClick={handleClick}
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Submit"}
                </button>
            </div>
        </div>
    )
}

export default CreateRoutine
