import createHttpError from "http-errors";
import { asyncHandler } from "../utils/asyncHandler";
import User from "../models/user.model";

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    return next(createHttpError(400, "All fields are required"));
  }

  const existeduser = await User.findOne({ email });
  if (existeduser) {
    return next(createHttpError(409, "User with this email already exists"));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    return next(
      createHttpError(500, "Something went wrong while registering the user")
    );
  }

  return res.status(201).json({
    message: "User registered successfully",
    data: createdUser,
  });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    return next(createHttpError(400, "All fields are required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(createHttpError(404, "User with this email does not exist"));
  }

  const isMatchPassword = await user.isPasswordCorrect(password);

  if (!isMatchPassword) {
    return next(createHttpError(400, "Invalid credentials"));
  }

  const token = user.generateToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200).cookie("token", token, options).json({
    message: "User logged in successfully",
    data: loggedInUser,
    token,
  });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .clearCookie("token")
    .json({ message: "User logged out successfully" });
});

export { registerUser, loginUser, logoutUser };
