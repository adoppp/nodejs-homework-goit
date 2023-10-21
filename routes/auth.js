import express from "express"

import authController from "../controllers/auth.js"
import { isEmptyBody } from "../middlewares/isEmptyBody.js"
import { userAddSchemaSignin, userAddSchemaSignup } from "../models/User.js"
import { validateBody } from "../middlewares/validateBody.js"
import authenticate from "../middlewares/authenticate.js"

const validateSigninSchema = validateBody(userAddSchemaSignin);
const validateSignupSchema = validateBody(userAddSchemaSignup);

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateSigninSchema, authController.signup)
authRouter.post('/login', isEmptyBody, validateSignupSchema, authController.signin)
authRouter.get('/current', authenticate, authController.getCurrent)
authRouter.post('/logout', authenticate, authController.signOut)

export default authRouter;