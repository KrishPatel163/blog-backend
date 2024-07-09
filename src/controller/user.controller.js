import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const handleRegister = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username && !email && !password) {
            throw new ApiError(401, "All fields are necessary");
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (existingUser) {
            throw new ApiError(401, "User already exisits");
        }

        const user = await User.create({
            username,
            email,
            password,
            role,
        });

        const accessToken = user.generateAccessToken();

        return res.status(200).send(
            new ApiResponse(
                200,
                {
                    user,
                    accessToken,
                },
                "User Created Successfully"
            )
        );
    } catch (error) {
        res.send(error);
    }
};

const handleLogin = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username && !email && !password) {
            throw new ApiError(401, "All fields are necessary");
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (!existingUser) {
            throw new ApiError(401, "No user exisits");
        }

        const correctPass = await existingUser.comparePassword(password);

        if (!correctPass) {
            throw new ApiError(401, "Password doesnt match");
        }

        const accessToken = existingUser.generateAccessToken();

        const cookieOption = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOption)
            .send(
                new ApiResponse(
                    200,
                    {
                        existingUser,
                        accessToken,
                    },
                    "User LoggedIn Successfully"
                )
            );
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

const handleLogout = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthoirzed Access");
        }

        const cookieOption = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .clearCookie("accessToken", cookieOption)
            .send(new ApiResponse(200, {}, "Logged Out successfully", true));
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

export { handleRegister, handleLogin, handleLogout };