import sanitizeHtml from "sanitize-html";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const createBlog = async (req, res, next) => {
    try {
        let { title, description } = req.body;
        const { author, designation } = req.body;
        console.log(author, designation);
        const localFilePath = req.file;

        if (
            !title &&
            !description &&
            !localFilePath &&
            !author &&
            !designation
        ) {
            throw new ApiError(401, "All fields are required");
        }

        title = sanitizeHtml(title);
        description = sanitizeHtml(description);

        console.log(title, description);

        const user = await User.findById(req.user.id);

        if (!user) {
            throw new ApiError(400, "invalid user on token");
        }

        const blog_img = await uploadToCloudinary(req.file.path);

        if (!blog_img) {
            throw new ApiError(500, "Image couldnt upload to cloudinary");
        }

        const blog = await Blog.create({
            title,
            description,
            author,
            designation,
            image: blog_img.url,
            owner: req.user.id,
        });

        if (!blog) {
            throw new ApiError(500, "Something went wrong while creating blog");
        }

        user.ownedBlogs.push(blog._id);
        await user.save({ validateBeforeSave: false });

        return res.status(200).send(
            new ApiResponse(
                200,
                {
                    blog,
                },
                "Blog Created Successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

const getAllBlogs = async (req, res, next) => {
    try {
        const allBlogs = await Blog.find();

        if (!allBlogs) {
            throw new ApiError(
                500,
                "Something went wrong while fetching all blogs"
            );
        }

        return res
            .status(200)
            .send(
                new ApiResponse(
                    200,
                    { allBlogs },
                    "All blogs Fetched Successfully"
                )
            );
    } catch (error) {
        next(error);
    }
};

const showSingleBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id).populate(
            "owner",
            "username"
        );

        if (!blog) {
            throw new ApiError(401, "Blog id is not on the records");
        }

        return res
            .status(200)
            .send(new ApiResponse(200, { blog }, "blog Fetched Successfully"));
    } catch (error) {
        next(error);
    }
};

const deleteBlog = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            throw new ApiError(400, "invalid user on token");
        }

        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

        if (!deletedBlog) {
            throw new ApiError(
                500,
                "Something went wrong while deleteing blog"
            );
        }

        user.ownedBlogs.pop(deletedBlog._id);
        await user.save({ validateBeforeSave: false });

        return res.status(200).send(
            new ApiResponse(
                200,
                {
                    deletedBlog,
                },
                "Blog Deleted Successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export { createBlog, getAllBlogs, showSingleBlog, deleteBlog };
