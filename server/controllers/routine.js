//controllers/routine.js

import Routine from "../models/Routine.js"
import User from "../models/User.js"

export const createRoutine = async (req, res, next) => {
    try {
        const { name, workout_type, body_part, link, author } = req.body;

        // Validate required fields
        if (!name || !workout_type || !body_part || !author) {
            return res.status(400).json({
                message: "Name, workout type, body part, and author are required"
            });
        }

        // Validate workout_type and body_part are not 'none'
        if (workout_type === 'none' || body_part === 'none') {
            return res.status(400).json({
                message: "Please select valid workout type and body part"
            });
        }

        const newRoutine = new Routine({
            name: name.trim(),
            workout_type,
            body_part,
            link: link || "",
            author
        });

        const savedRoutine = await newRoutine.save();

        // Update user's routines array
        try {
            await User.findByIdAndUpdate(
                author,
                { $push: { routines: savedRoutine._id } }
            );
        } catch (err) {
            console.error("Error updating user routines:", err);
        }

        res.status(201).json({
            message: "Routine created successfully",
            routine: savedRoutine
        });
    } catch (err) {
        console.error("Routine creation error:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error: " + Object.values(err.errors).map(e => e.message).join(', ')
            });
        }
        next(err);
    }
};

export const updateRoutine = async (req, res, next) => {
    try {
        const routine = await Routine.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        if (!routine) {
            return res.status(404).json({
                message: "Routine not found"
            });
        }
        
        res.status(200).json({
            message: "Routine updated successfully",
            routine
        });
    } catch (err) {
        next(err);
    }
};

export const deleteRoutine = async (req, res, next) => {
    try {
        const routine = await Routine.findByIdAndDelete(req.params.id);
        
        if (!routine) {
            return res.status(404).json({
                message: "Routine not found"
            });
        }

        // Remove routine from user's routines array
        try {
            await User.findByIdAndUpdate(
                routine.author,
                { $pull: { routines: req.params.id } }
            );
        } catch (err) {
            console.error("Error removing routine from user:", err);
        }

        res.status(200).json({
            message: "Routine deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export const getRoutines = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const routines = await Routine.find({ author: userId })
            .sort({ createdAt: -1 });
        res.status(200).json(routines);
    } catch (err) {
        next(err);
    }
}