import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  updateBookCoverImage,
  updateBookFile,
} from "../controllers/book.controller";
import { upload } from "../middlewares/multer.middleware";
import verifyJwt from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/create").post(
  verifyJwt,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),

  createBook
);

router.route("/update/:bookId").patch(verifyJwt, updateBook);
router.route("/delete/:bookId").delete(verifyJwt, deleteBook);
router.route("/all").get(getAllBooks);
router.route("/:bookId").get(verifyJwt, getSingleBook);
router
  .route("/update-book-file/:bookId")
  .patch(verifyJwt, upload.single("file"), updateBookFile);
router
  .route("/update-book-coverImage/:bookId")
  .patch(verifyJwt, upload.single("coverImage"), updateBookCoverImage);

export default router;
