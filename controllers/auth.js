import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import User from "../models/User.js";
import fs from 'fs/promises';
import path from "path";
import gravatar from 'gravatar'
import Jimp from "jimp";

const { JWT_SECRET } = process.env;

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

        const avatarUrl = path.join('public', 'avatars', filename)
        
        await Jimp.read(avatarUrl)
            .then((avatar) => {
                return avatar
                    .resize(250, 250) // resize
            })
            .catch((err) => {
                throw new Error;
            }
            )

        const newUser = await User.create({ ...req.body, avatarUrl, password: hashPassword });

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            }
        })

    }

    const newUser = await User.create({ ...req.body, avatarUrl: gravatar.url(email, {s: 250}), password: hashPassword });

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
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

    const avatarUrl = path.join('public', 'avatars', filename)

    await User.findOneAndUpdate({email}, { avatarUrl }, {new: true})
    
    res.status(200).json({
        avatarUrl
    })
}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signOut: ctrlWrapper(signOut),
    updateAvatar: ctrlWrapper(updateAvatar),
}