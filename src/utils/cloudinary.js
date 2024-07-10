import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECERT,
});

const uploadToCloudinary = async (localFile) => {
    try {
        if (!localFile) {
            throw new ApiError(500, "Couldnt locate the file path");
        }
        const uploadedImage = await cloudinary.uploader.upload(localFile, {
            resource_type: "image",
        });
        fs.unlinkSync(localFile);
        return uploadedImage;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFile);
        throw new ApiError(500, "Something went wrong while uploading");
    }
};

export { uploadToCloudinary };
