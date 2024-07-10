import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    createBlog,
    deleteBlog,
    getAllBlogs,
    showSingleBlog,
} from "../controller/blog.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("blog-img"), createBlog);
router.route("/show-all").get(getAllBlogs);
router.route("/:id").get(showSingleBlog);
router.route("/:id").delete(verifyJWT, deleteBlog);

export default router;
