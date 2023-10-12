import express from "express"

import authController from "../controllers/auth.js"
import { isEmptyBody } from "../middlewares/isEmptyBody.js"
import { isValidId } from "../middlewares/IsValidId.js"
import { userAddSchemaSignin, userAddSchemaSignup } from "../models/User.js"
import { validateBody } from "../middlewares/validateBody.js"

const validateSigninSchema = validateBody(userAddSchemaSignin);
const validateSignupSchema = validateBody(userAddSchemaSignup);

const authRouter = express.Router();

authRouter.post('/users/register', isEmptyBody, validateSigninSchema, authController.signup)
authRouter.post('/users/login', isEmptyBody, validateSignupSchema, authController.signin)

export default authRouter;