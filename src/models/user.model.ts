import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateToken: () => string;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: [true, "Please provide your Name"] },

    email: {
      type: String,
      required: [true, "Please provide your Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide your Password"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (
  this: IUser,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function (this: IUser): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    config.tokenSecret!,
    {
      expiresIn: config.tokenExpiry,
    }
  );
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
