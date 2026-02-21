import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";
import { checkUser } from "../middleware/checkUser.js";

const router = express.Router();

router.route("/:id").get(getReviews).post(checkUser, addReview);

export default router;