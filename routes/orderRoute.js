
import express from 'express';
import { createOrder, getOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { notAllowed } from '../utils/notAllowed.js';
import { checkUser } from '../middleware/checkUser.js';

const router = express.Router();


router.route('/api/orders')
.get(checkUser,getOrders)   //admin or user
.post(checkUser,createOrder)  // user creates order
.all(notAllowed);

// single order
router.route('/api/orders/:id')
.get(getOrder).all(notAllowed);


// Update order status (admin only)
router.route('/api/orders/:orderId/status')
  .patch(checkUser, updateOrderStatus)
  .all(notAllowed);

export default router;