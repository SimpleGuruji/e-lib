import express from "express";
import globalErrorHandler from "./middlewares/error";
const app = express();

app.use(globalErrorHandler);

export default app;
