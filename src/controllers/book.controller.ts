import createHttpError from "http-errors";
import { asyncHandler } from "../utils/asyncHandler";
import Book from "../models/book.model";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { isValidObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";

const createBook = asyncHandler(async (req, res, next) => {
  const { title, genre } = req.body;
  if ([title, genre].some((field) => field?.trim() === ""))
    return next(createHttpError(400, "All fields are required"));

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const fileLocalPath = files.file[0].path;

  if (!fileLocalPath)
    return next(createHttpError(400, "Book file is required."));

  const coverImageLocalPath = files.coverImage[0].path;

  if (!coverImageLocalPath)
    return next(createHttpError(400, "Cover image is required."));

  const file = await uploadOnCloudinary(fileLocalPath);

  if (!file)
    return next(
      createHttpError(
        500,
        "Something went wrong while uploading book file on cloudinary."
      )
    );

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage)
    return next(
      createHttpError(
        500,
        "Something went wrong while uploading book cover image on cloudinary."
      )
    );

  const book = await Book.create({
    title,
    genre,
    file: file?.url || "",
    coverImage: coverImage?.url || "",
    author: req.user?._id,
  });

  return res.status(200).json({
    success: true,
    data: book,
    message: "Book created successfully",
  });
});

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    const { bookId } = req.params;

    if (!isValidObjectId(bookId))
      return next(createHttpError(400, "Invalid book id."));

    const book = await Book.findById(bookId);

    if (!book) return next(createHttpError(404, "Book not found"));

    if (book.author.toString() !== req.user?._id?.toString())
      return next(
        createHttpError(401, "You are not authorized to update this book.")
      );

    const updateBook = await Book.findByIdAndUpdate(
      bookId,
      {
        $set: {
          title,
          genre,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updateBook,
      message: "Book updated successfully.",
    });
  } catch (error) {
    return next(
      createHttpError(500, "Something went wrong while updating book")
    );
  }
};

const updateBookFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;

    if (!isValidObjectId(bookId))
      return next(createHttpError(400, "Invalid book id."));

    const book = await Book.findById(bookId);

    if (!book) return next(createHttpError(404, "Book not found"));

    if (book.author.toString() !== req.user?._id?.toString())
      return next(
        createHttpError(401, "You are not authorized to update this book.")
      );

    const fileLocalPath = req.file?.path;

    if (!fileLocalPath)
      return next(createHttpError(400, " Book file is required"));

    const file = await uploadOnCloudinary(fileLocalPath);

    if (!file)
      return next(
        createHttpError(
          500,
          "Something went wrong while uploading book file on cloudinary. "
        )
      );

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: { file: file?.url } },
      { new: true }
    );

    const deletePreviousFile = await deleteOnCloudinary(book.file);

    if (!deletePreviousFile)
      return next(
        createHttpError(
          500,
          "Something went wrong while deleting file on cloudinary."
        )
      );

    return res.status(200).json({
      success: true,
      data: updatedBook,
      message: "Book file updated successfully.",
    });
  } catch (error) {
    return next(
      createHttpError(500, "Something went wrong while updating book file")
    );
  }
};

const updateBookCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;

    if (!isValidObjectId(bookId))
      return next(createHttpError(400, "Invalid book id."));

    const book = await Book.findById(bookId);

    if (!book) return next(createHttpError(404, "Book not found"));

    if (book.author.toString() !== req.user?._id?.toString())
      return next(
        createHttpError(401, "You are not authorized to update this book.")
      );

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath)
      return next(createHttpError(400, " Cover image is required"));

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage)
      return next(
        createHttpError(
          500,
          "Something went wrong while uploading cover image on cloudinary. "
        )
      );

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: { coverImage: coverImage.url } },
      { new: true }
    );

    const deletePreviousCoverImage = await deleteOnCloudinary(book.coverImage);

    if (!deletePreviousCoverImage)
      return next(
        createHttpError(
          500,
          "Something went wrong while deleting book cover image on cloudinary."
        )
      );

    return res.status(200).json({
      success: true,
      data: updatedBook,
      message: "cover image updated successfully.",
    });
  } catch (error) {
    return next(
      createHttpError(
        500,
        "Something went wrong while updating book cover image"
      )
    );
  }
};

const getAllBooks = asyncHandler(async (req, res, next) => {
  const books = await Book.find();
  if (!books) return next(createHttpError(404, "No book found"));
  return res.status(200).json({
    success: true,
    data: books,
    message: "Books fetched successfully",
  });
});

const getSingleBook = asyncHandler(async (req, res, next) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId))
    return next(createHttpError(400, "Invalid book id."));

  const book = await Book.findById(bookId);

  if (!book) return next(createHttpError(404, "Book not found"));

  return res
    .status(200)
    .json({ success: true, data: book, message: "Book fetched successfully" });
});

const deleteBook = asyncHandler(async (req, res, next) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId))
    return next(createHttpError(400, "Invalid book id."));

  const book = await Book.findById(bookId);

  if (!book) return next(createHttpError(404, "Book not found"));

  if (book.author.toString() !== req.user?._id?.toString())
    return next(
      createHttpError(401, "You are not authorized to delete this book.")
    );

  const deletedBook = await Book.findByIdAndDelete(bookId);

  if (!deletedBook)
    return next(
      createHttpError(500, "Something went wrong while deleting book")
    );

  return res
    .status(200)
    .json({ success: true, message: "Book deleted successfully" });
});

export {
  createBook,
  updateBook,
  updateBookCoverImage,
  updateBookFile,
  getAllBooks,
  getSingleBook,
  deleteBook,
};
