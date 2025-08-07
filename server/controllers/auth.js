//controllers/auth.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        // Validate required fields
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "Username, email, and password are required" 
            });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(409).json({ 
                message: "Username already exists" 
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(409).json({ 
                message: "Email already exists" 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Please enter a valid email address" 
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                message: "Password must be at least 6 characters long" 
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            email,
            password: hash,
            profilePicture: req.body.profilePicture || ""
        });

        await newUser.save();
        res.status(201).json({ 
            message: "User has been created successfully" 
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({ 
                message: "Username and password are required" 
            });
        }

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ 
                message: "Wrong password or username" 
            });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT || "your-secret-key"
        );

        const { password: userPassword, isAdmin, ...otherDetails } = user._doc;
        
        res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            })
            .status(200)
            .json({ 
                details: { ...otherDetails }, 
                isAdmin,
                message: "Login successful"
            });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        res
            .clearCookie("access_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            })
            .status(200)
            .json({ 
                message: "Logged out successfully" 
            });
    } catch (err) {
        next(err);
    }
};