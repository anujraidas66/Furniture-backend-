import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { updateAddress } from '../controllers/addressController.js';

const router = express.Router();

router.patch('/:id',authMiddleware,updateAddress)

export default router;