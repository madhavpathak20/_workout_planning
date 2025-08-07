//controllers/meal.js

import Meal from "../models/Meal.js"
import User from "../models/User.js"

export const createMeal = async (req, res, next) => {
    try {
        const { name, description, recipe, time, category, author } = req.body;

        // Validate required fields
        if (!name || !description || !time || !category || !author) {
            return res.status(400).json({
                message: "Name, description, time, category, and author are required"
            });
        }

        // Validate category is not 'none'
        if (category === 'none') {
            return res.status(400).json({
                message: "Please select a valid category"
            });
        }

        // Validate time is a positive number
        if (time <= 0) {
            return res.status(400).json({
                message: "Time must be a positive number"
            });
        }

        const newMeal = new Meal({
            name: name.trim(),
            description: description.trim(),
            recipe: recipe || "",
            time: parseInt(time),
            category,
            author
        });

        const savedMeal = await newMeal.save();

        // Update user's meals array
        try {
            await User.findByIdAndUpdate(
                author,
                { $push: { meals: savedMeal._id } }
            );
        } catch (err) {
            console.error("Error updating user meals:", err);
        }

        res.status(201).json({
            message: "Meal created successfully",
            meal: savedMeal
        });
    } catch (err) {
        console.error("Meal creation error:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error: " + Object.values(err.errors).map(e => e.message).join(', ')
            });
        }
        next(err);
    }
};

export const updateMeal = async (req, res, next) => {
    try {
        const meal = await Meal.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        if (!meal) {
            return res.status(404).json({
                message: "Meal not found"
            });
        }
        
        res.status(200).json({
            message: "Meal updated successfully",
            meal
        });
    } catch (err) {
        next(err);
    }
};

export const deleteMeal = async (req, res, next) => {
    try {
        const meal = await Meal.findByIdAndDelete(req.params.id);
        
        if (!meal) {
            return res.status(404).json({
                message: "Meal not found"
            });
        }

        // Remove meal from user's meals array
        try {
            await User.findByIdAndUpdate(
                meal.author,
                { $pull: { meals: req.params.id } }
            );
        } catch (err) {
            console.error("Error removing meal from user:", err);
        }

        res.status(200).json({
            message: "Meal deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export const getMeals = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const meals = await Meal.find({ author: userId })
            .sort({ createdAt: -1 });
        res.status(200).json(meals);
    } catch (err) {
        next(err);
    }
}