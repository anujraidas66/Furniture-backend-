
import express from 'express';
import { adminAuthenticate, authMiddleware } from '../middlewares/authMiddleware.js';
import { cancelOrder, createOrder, getAllOrders, getSingleOrder, updateOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', authMiddleware,createOrder);
router.get('/',authMiddleware,getAllOrders);
router.get('/:id',authMiddleware,getSingleOrder);
router.patch('/:id',authMiddleware, adminAuthenticate,updateOrder);
router.delete('/:id',authMiddleware,cancelOrder);

export default router;