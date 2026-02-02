
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/add',authMiddleware,addToCart);
router.get('/',authMiddleware,getCart);
router.delete('remove', authMiddleware,removeFromCart);


export default router;