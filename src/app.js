import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Import Routers
import userRouter from "./routes/user.router.js";
import blogRouter from "./routes/blogs.router.js";


app.use("/api/v1/users", userRouter)
app.use("/api/v1/blogs", blogRouter);

export default app;
