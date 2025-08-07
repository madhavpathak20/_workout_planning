//components/create/CreateMeal.jsx

import './popUp.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from 'react';
import axios from "axios"
import { AuthContext } from '../../authContext';
import { category } from '../../data';

const CreateMeal = ({ setOpen }) => {

    const { user } = useContext(AuthContext);
    const [info, setInfo] = useState({
        name: '',
        description: '',
        recipe: '',
        time: '',
        category: 'none'
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!info.name.trim()) {
            newErrors.name = "Meal name is required";
        }
        
        if (!info.description.trim()) {
            newErrors.description = "Description is required";
        }
        
        if (!info.time || info.time <= 0) {
            newErrors.time = "Please enter a valid time in minutes";
        }
        
        if (info.category === 'none') {
            newErrors.category = "Please select a category";
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
            alert("Please login to create a meal");
            return;
        }

        setIsLoading(true);

        const newMeal = {
            ...info, 
            author: user._id
        }

        try {
            await axios.post("https://shapesync-5rkn.onrender.com/api/meals", newMeal, {
                withCredentials: true
            });
            setOpen(false);
            alert("Meal created successfully!");
            // Optionally refresh the page or update the parent component
            window.location.reload();
        } catch (err) {
            console.error("Meal creation error:", err);
            let errorMessage = "Failed to create meal. Please try again.";
            
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

                <div className="mTitle">Add Meal</div>

                <form onSubmit={handleClick}>
                    <div className="formInput">
                        <input
                            className={errors.name ? 'error' : ''}
                            type="text"
                            onChange={handleChange}
                            id="name"
                            value={info.name}
                            placeholder='Enter your Meal name'
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    
                    <div className="formInput">
                        <textarea
                            name="Description"
                            id="description"
                            cols="30"
                            rows="10"
                            onChange={handleChange}
                            value={info.description}
                            className={errors.description ? 'error' : ''}
                            placeholder='Add meal details'>
                        </textarea>
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>
                    
                    <div className="formInput">
                        <input
                            type="text"
                            onChange={handleChange}
                            id="recipe"
                            value={info.recipe}
                            placeholder='Add recipe links (optional)'
                        />
                    </div>
                    
                    <div className="formInput">
                        <input
                            className={errors.time ? 'error' : ''}
                            type="number"
                            onChange={handleChange}
                            id="time"
                            value={info.time}
                            placeholder='Enter time in minutes'
                            min="1"
                        />
                        {errors.time && <span className="error-message">{errors.time}</span>}
                    </div>
                    
                    <div className="formInput" id='options'>
                        <label>Choose Category</label>
                        <select 
                            id="category" 
                            onChange={handleChange}
                            value={info.category}
                            className={errors.category ? 'error' : ''}
                        >
                            <option key={0} value="none">-</option>
                            {
                                category.map((c, index) => (
                                    <option key={index} value={c}>{c}</option>
                                ))
                            }
                        </select>
                        {errors.category && <span className="error-message">{errors.category}</span>}
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

export default CreateMeal
