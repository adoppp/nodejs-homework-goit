import express from "express"

import authController from "../controllers/auth.js"
import { isEmptyBody } from "../middlewares/isEmptyBody.js"
import { userAddSchemaSignin, userAddSchemaSignup, userEmailSchema } from "../models/User.js"
import { validateBody } from "../middlewares/validateBody.js"
import authenticate from "../middlewares/authenticate.js"
import upload from "../middlewares/upload.js"

const validateSigninSchema = validateBody(userAddSchemaSignin);
const validateSignupSchema = validateBody(userAddSchemaSignup);
const validateEmailSchema = validateBody(userEmailSchema);

const authRouter = express.Router();

//upload.fields([{name: 'avatarUrl, maxCount: 1}])
//name-имя поля в котором будет файл
//maxCount-максимальное кол-во файлов в этом поле
//мы передаем массив объектов в котром указываем каждое поле файла(каждый объект описывает одно поле)
//
//upload.array('avatarUrl', 8) если больше одного файла, 8-максимальное кол-во файлов
authRouter.post('/register', upload.single('avatarUrl'), isEmptyBody, validateSigninSchema, authController.signup)

authRouter.get('/verify/:verificationToken', authController.verify)

authRouter.post('/verify', isEmptyBody, validateEmailSchema, authController.verifyRefresh)

authRouter.post('/login', isEmptyBody, validateSignupSchema, authController.signin)

authRouter.get('/current', authenticate, authController.getCurrent)

authRouter.post('/logout', authenticate, authController.signOut)

authRouter.patch('/avatars', authenticate, upload.single('avatarUrl'), authController.updateAvatar)

export default authRouter;