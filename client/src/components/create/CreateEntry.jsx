//components/create/CreateEntry.jsx

import './popUp.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from 'react';
import axios from "axios"
import useFetch from '../../useFetch';
import { AuthContext } from '../../authContext';

const CreateEntry = ({ setOpen }) => {

    const { user } = useContext(AuthContext);
    const [info, setInfo] = useState({
        date: '',
        meals: [],
        routines: []
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const { data, loading, error } = useFetch(`/entries/fetchMealsAndRoutines/${user?._id}`);

    const validateForm = () => {
        const newErrors = {};
        
        if (!info.date) {
            newErrors.date = "Date is required";
        }
        
        if (!info.meals || info.meals.length === 0) {
            newErrors.meals = "Please select at least one meal";
        }
        
        if (!info.routines || info.routines.length === 0) {
            newErrors.routines = "Please select at least one routine";
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
            alert("Please login to create an entry");
            return;
        }

        setIsLoading(true);

        const newEntry = {
            ...info, 
            author: user._id
        }

        try {
            await axios.post('http://localhost:7700/api/entries/', newEntry, {
                withCredentials: true
            });
            setOpen(false);
            alert("Entry created successfully!");
            // Optionally refresh the page or update the parent component
            window.location.reload();
        } catch (err) {
            console.error("Entry creation error:", err);
            let errorMessage = "Failed to create entry. Please try again.";
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const handleMultiSelectChange = (e) => {
        const { id, options } = e.target;
        const selectedOptions = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setInfo(prev => ({ ...prev, [id]: selectedOptions }));
        
        // Clear error when user makes selection
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: "" }));
        }
    }

    if (loading) {
        return (
            <div className="modal">
                <div className="mContainer">
                    <div className="mTitle">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modal">
                <div className="mContainer">
                    <div className="mTitle">Error loading data</div>
                    <button className="mButton" onClick={() => setOpen(false)}>
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal">
            <div className="mContainer">

                <FontAwesomeIcon icon={faXmark} className="mClose" onClick={() => setOpen(false)} />

                <div className="mTitle">Create Entry</div>

                <form onSubmit={handleClick}>
                    <div className="formInput">
                        <input
                            className={errors.date ? 'error' : ''}
                            type="date"
                            onChange={handleChange}
                            id="date"
                            value={info.date}
                        />
                        {errors.date && <span className="error-message">{errors.date}</span>}
                    </div>

                    <div className="formInput" id='options'>
                        <label>Choose Meals</label>
                        <select
                            id="meals"
                            multiple
                            onChange={handleMultiSelectChange}
                            className={errors.meals ? 'error' : ''}
                        >
                            {data?.meals?.map((meal, index) => (
                                <option key={index} value={meal._id}>{meal.name}</option>
                            ))}
                        </select>
                        {errors.meals && <span className="error-message">{errors.meals}</span>}
                    </div>

                    <div className="formInput" id='options'>
                        <label>Choose Routines</label>
                        <select
                            id="routines"
                            multiple
                            onChange={handleMultiSelectChange}
                            className={errors.routines ? 'error' : ''}
                        >
                            {data?.routines?.map((routine, index) => (
                                <option key={index} value={routine._id}>{routine.name}</option>
                            ))}
                        </select>
                        {errors.routines && <span className="error-message">{errors.routines}</span>}
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

export default CreateEntry