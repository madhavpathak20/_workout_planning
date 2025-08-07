//models/User.js

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true,
            trim: true,
            minlength: 3
        },
        email: { 
            type: String, 
            required: true, 
            unique: true,
            trim: true,
            lowercase: true
        },
        password: { 
            type: String, 
            required: true,
            minlength: 6
        },
        profilePicture: { 
            type: String, 
            default: "" 
        },
        routines: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Routine'
            }
        ],
        entries: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Entry'
            }
        ],
        meals: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Meal'
            }
        ],
    },
    {
        timestamps: true
    }
)

export default mongoose.model("User", UserSchema);