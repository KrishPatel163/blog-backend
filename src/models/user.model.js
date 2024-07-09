import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            min: 5,
        },
        email: {
            type: String,
            required: true,
            index: true,
            min: 5,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        role: {
            type: String,
            required: true,
            enum: ["user", "content-creator", "admin"],
            default: "user",
        },
        ownedBlogs: [
            {
                type: Schema.Types.ObjectId,
                ref: "Blogs",
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        return (this.password = await bcrypt.hash(this.password, 10));
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            username: this.username,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECERT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
