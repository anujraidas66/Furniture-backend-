import express from "express";
import { 
  cancelOrder,
  createOrder, 
  getOrder, 
  getOrders, 
  updateOrderStatus 
} from "../controllers/orderController.js";
import { checkUser } from "../middleware/checkUser.js";
import { notAllowed } from "../utils/notAllowed.js";

const router = express.Router();


router.route("/api/orders")
  .get(checkUser, getOrders)       // fetch all orders (admin sees all)
  .post(checkUser, createOrder)    // create order (user)
  .all(notAllowed);

router.route("/api/orders/:id")
  .get(checkUser, getOrder)
  .all(notAllowed);


router.route("/api/orders/:orderId/status")
  .patch(checkUser, updateOrderStatus)
  .all(notAllowed);


  // Cancel order (User or Admin)
router.route('/api/orders/:orderId/cancel')
  .patch(checkUser, cancelOrder)
  .all(notAllowed);


export default router;






// import express from 'express';
// import { createOrder, getOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
// import { notAllowed } from '../utils/notAllowed.js';
// import { checkUser } from '../middleware/checkUser.js';

// const router = express.Router();


// router.route('/api/orders')
// .get(checkUser,getOrders)   //admin or user
// .post(checkUser,createOrder)  // user creates order
// .all(notAllowed);

// // single order
// router.route('/api/orders/:id')
// .get(getOrder).all(notAllowed);


// // Update order status (admin only)
// router.route('/api/orders/:orderId/status')
//   .patch(checkUser, updateOrderStatus)
//   .all(notAllowed);

// export default router;