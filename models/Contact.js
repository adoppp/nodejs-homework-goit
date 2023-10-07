import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidatorsUpdate} from "./hooks.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        required: [true, 'Set email for contact'],
    },
    phone: {
        type: String,
        required: [true, 'Set phone for contact'],
    },
    favorite: {
        type: Boolean,
        default: false,
    },
});

contactSchema.post("save", handleSaveError)

contactSchema.pre("findOneAndUpdate", runValidatorsUpdate)

contactSchema.post("findOneAndUpdate", handleSaveError)

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required name field`
  }),
  email: Joi.string().email().required().messages({
    "any.required": `missing required email field`
  }),
  phone: Joi.string().required().messages({
    "any.required": `missing required phone field`
  }),
  favorite: Joi.boolean(),
})

const Contact = model("contact", contactSchema);

export default Contact;