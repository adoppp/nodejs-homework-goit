import { HttpError } from "../helpers/HttpError.js";
import jwt from 'jsonwebtoken'
import User from "../models/User.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
        return next(HttpError(401))
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(id);
        req.user = user;
        if (!user  || !user.token) {
            return next(HttpError(401));
        };

        next()
    } catch (error) {
        next(HttpError(401))
    }
};

export default authenticate;