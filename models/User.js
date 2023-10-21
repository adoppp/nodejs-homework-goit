import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidatorsUpdate } from "./hooks.js";

const userSchema = new Schema({
    password: {
        type: String,
        minLength: 6,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarUrl: {
        type: String,
    }
}, {versionKey: false, timestamps: true})

userSchema.post("save", handleSaveError)

userSchema.pre("findOneAndUpdate", runValidatorsUpdate)

userSchema.post("findOneAndUpdate", handleSaveError)

export const userAddSchemaSignup = Joi.object({
    password: Joi.string().min(6).required().messages({
        "any.required": `missing required password field`
    }),
    email: Joi.string().email().required().messages({
        "any.required": `missing required email field`
    }),
});

export const userAddSchemaSignin = Joi.object({
    password: Joi.string().min(6).required().messages({
        "any.required": `missing required password field`
    }),
    email: Joi.string().email().required().messages({
        "any.required": `missing required email field`
    }),
});

const User = model("user", userSchema);

export default User;