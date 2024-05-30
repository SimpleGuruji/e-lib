import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IBook extends Document {
  _id: string;
  title: string;
  author: IUser;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new mongoose.Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      requied: true,
    },
    genre: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model<IBook>("book", bookSchema);

export default Book;
