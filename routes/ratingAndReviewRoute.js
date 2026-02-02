import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createRatingAndReview, getAllRatingAndReview } from '../controllers/ratingAndReviewController.js';

const router = express.Router();

router.get('/',getAllRatingAndReview);
router.post('/', authMiddleware,createRatingAndReview);

export default router;