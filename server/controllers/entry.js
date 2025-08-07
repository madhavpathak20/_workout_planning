//controllers/entry.js

import Entry from "../models/Entry.js"
import User from "../models/User.js"
import Routine from "../models/Routine.js"
import Meal from "../models/Meal.js"

export const createEntry = async (req, res, next) => {
    try {
        const { date, meals, routines, author } = req.body;

        // Validate required fields
        if (!date || !meals || !routines || !author) {
            return res.status(400).json({
                message: "Date, meals, routines, and author are required"
            });
        }

        // Validate that meals and routines are arrays
        if (!Array.isArray(meals) || !Array.isArray(routines)) {
            return res.status(400).json({
                message: "Meals and routines must be arrays"
            });
        }

        // Validate that at least one meal and one routine is selected
        if (meals.length === 0 || routines.length === 0) {
            return res.status(400).json({
                message: "Please select at least one meal and one routine"
            });
        }

        const newEntry = new Entry({
            date: new Date(date),
            meals,
            routines,
            author
        });

        const savedEntry = await newEntry.save();

        // Update user's entries array
        try {
            await User.findByIdAndUpdate(
                author,
                { $push: { entries: savedEntry._id } }
            );
        } catch (err) {
            console.error("Error updating user entries:", err);
        }

        res.status(201).json({
            message: "Entry created successfully",
            entry: savedEntry
        });
    } catch (err) {
        console.error("Entry creation error:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error: " + Object.values(err.errors).map(e => e.message).join(', ')
            });
        }
        next(err);
    }
};

export const updateEntry = async (req, res, next) => {
    try {
        const entry = await Entry.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        if (!entry) {
            return res.status(404).json({
                message: "Entry not found"
            });
        }
        
        res.status(200).json({
            message: "Entry updated successfully",
            entry
        });
    } catch (err) {
        next(err);
    }
};

export const deleteEntry = async (req, res, next) => {
    try {
        const entry = await Entry.findByIdAndDelete(req.params.id);
        
        if (!entry) {
            return res.status(404).json({
                message: "Entry not found"
            });
        }

        // Remove entry from user's entries array
        try {
            await User.findByIdAndUpdate(
                entry.author,
                { $pull: { entries: req.params.id } }
            );
        } catch (err) {
            console.error("Error removing entry from user:", err);
        }

        res.status(200).json({
            message: "Entry deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export const getEntries = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const entries = await Entry.find({ author: userId })
            .populate('meals', 'name')
            .populate('routines', 'name')
            .sort({ date: -1 });
            
        res.status(200).json(entries);
    } catch (err) {
        next(err);
    }
}

export const getMealsAndRoutines = async (req, res, next) => {
    const userId = req.params.id;
    
    if (!userId) {
        return res.status(400).json({
            message: "User ID is required"
        });
    }
    
    try {
        const [userRoutines, userMeals] = await Promise.all([
            Routine.find({ author: userId }).select('name _id').exec(),
            Meal.find({ author: userId }).select('name _id').exec()
        ]);
        
        const result = {
            routines: userRoutines,
            meals: userMeals
        };
        
        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching meals and routines:", err);
        next(err);
    }
}