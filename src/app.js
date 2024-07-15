import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET, POST, PUT, PATCH, DELETE",
        credentials: true,
    })
);

// Import Routers
import userRouter from "./routes/user.router.js";
import blogRouter from "./routes/blogs.router.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);

app.use(errorMiddleware);

export default app;
