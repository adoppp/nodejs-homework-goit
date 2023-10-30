import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import User from "../models/User.js";
import fs from 'fs/promises';
import path from "path";
import gravatar from 'gravatar'
import Jimp from "jimp";
import sendEmail from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const { JWT_SECRET, BASE_URL } = process.env;

const posterPath = path.resolve('public', 'avatars')

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, `Email in use`)
    }

    const hashPassword = await bcrypt.hash(password, 10);


    if (req.file) {
        const { path: oldPath, filename } = req.file;

        const newPath = path.join(posterPath, filename)

        await fs.rename(oldPath, newPath)

        const image = await Jimp.read(newPath);
        image.resize(250, 250);
        await image.writeAsync(newPath);

        const avatarUrl = path.join('avatars', filename)

        const newUser = await User.create({ ...req.body, avatarUrl, password: hashPassword });

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            }
        })

    }

    const verificationToken = nanoid();

    const newUser = await User.create({ ...req.body, avatarUrl: gravatar.url(email, { s: 250 }), password: hashPassword, verificationToken });
    
    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html:`<a target='_blank' href='${BASE_URL}/api/users/verify/${verificationToken}'>Click to verify</a>`
    }

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw HttpError(404);
    }

    await User.findOneAndUpdate(user._id, { verificationToken: null, verify: true })
    
    res.status(200).json({
        message: 'Verification successful',
    })
}

const verifyRefresh = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user.verify === true) {
        throw HttpError(400, 'Verification has already been passed')
    }

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html:`<a target='_blank' href='${BASE_URL}/api/users/verify/${user.verificationToken}'>Click to verify</a>`
    }

    await sendEmail(verifyEmail);

    res.status(200).json({
        message: "Verification email sent"
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }

    if (!user.verify) {
        throw HttpError(400, 'First verify email')
    }

    const passwordCompare = bcrypt.compare(password, user.password)

    if (!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' })
    await User.findOneAndUpdate(user._id, {token})

    res.json({
        token,
        user: {
            email: "example@example.com",
            subscription: user.subscription,
        },
    })
}

const signOut = async (req, res) => {
    const { _id } = req.user;

    await User.findOneAndUpdate(_id, { token: "" })
    
    res.status(204).json({
        message: "Sucsesfull logout"
    })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    })
}

const updateAvatar = async (req, res) => {
    const { email } = req.user;

    const { path: oldPath, filename } = req.file;

    const newPath = path.join(posterPath, filename)

    await fs.rename(oldPath, newPath)

    const image = await Jimp.read(newPath);
    image.resize(250, 250);
    await image.writeAsync(newPath);

    const avatarUrl = path.join('avatars', filename)

    await User.findOneAndUpdate({email}, { avatarUrl }, {new: true})
    
    res.status(200).json({
        avatarUrl
    })
}

export default {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    verifyRefresh: ctrlWrapper(verifyRefresh),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signOut: ctrlWrapper(signOut),
    updateAvatar: ctrlWrapper(updateAvatar),
}