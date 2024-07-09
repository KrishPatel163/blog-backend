import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
    try {
        const incomingToken =
            req.cookies.accessToken ||
            req.header("Authorization").replace("Bearer ", "");

        if (!incomingToken) {
            throw new ApiError(401, "Token not found");
        }

        const decodedToken = jwt.verify(
            incomingToken,
            process.env.ACCESS_TOKEN_SECERT
        );

        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized Access!!");
        }

        const user = await User.findById(decodedToken.id);

        if (!user) {
            throw new ApiError(401, "Token is invalid or used");
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export {
    verifyJWT
}