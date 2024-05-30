import createHttpError from "http-errors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import User from "../models/user.model";

export interface JwtPayload {
  _id: string;
  email: string;
  name: string;
}

const verifyJwt = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return next(createHttpError(401, "Token not provided."));

  const decodedToken = jwt.verify(token, config.tokenExpiry!) as JwtPayload;

  if (!decodedToken) return next(createHttpError(401, "Unauthorized request"));

  const user = await User.findById(decodedToken._id).select("-password");

  if (!user) return next(createHttpError(404, "User not found."));

  req.user = user;
});

export default verifyJwt;
