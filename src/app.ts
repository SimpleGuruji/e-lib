import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

app.use(cors());

import userRouter from "./routes/user.routes";
import globalErrorHandler from "./middlewares/error.middleware";

app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);

export default app;
