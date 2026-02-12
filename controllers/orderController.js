import { Order } from "../models/Order.js";

/**
 * Fetch single order
 */
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate([
      { path: "products.productId", model: "Product" },
      { path: "userId", model: "User", select: "-password" }
    ]);

    if (!order) return res.status(404).json({ status: "error", message: "Order not found" });

    res.status(200).json({ status: "success", order });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * Fetch all orders
 */
export const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.role === "admin") {
      orders = await Order.find({}).populate([
        { path: "products.productId", model: "Product" },
        { path: "userId", model: "User", select: "-password" }
      ]);
    } else {
      orders = await Order.find({ userId: req.userId }).populate([
        { path: "products.productId", model: "Product" },
        { path: "userId", model: "User", select: "-password" }
      ]);
    }

    res.status(200).json({ status: "success", orders });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * Create order
 */
export const createOrder = async (req, res) => {
  const { totalAmount, products, billingDetails, paymentMethod } = req.body ?? {};

  if (!products || products.length === 0) {
    return res.status(400).json({ status: "error", message: "Cart is empty" });
  }

  try {
    const order = await Order.create({
      totalAmount,
      userId: req.userId,
      products,
      billingDetails,
      paymentMethod
    });

    res.status(201).json({ status: "success", message: "Order created successfully", order });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * Update order status (admin only)
 */
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (req.role !== "admin") {
    return res.status(403).json({ status: "error", message: "Forbidden: admin only" });
  }

  const allowedStatus = ["pending", "confirmed", "shipped", "delivered"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ status: "error", message: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ status: "error", message: "Order not found" });

    res.status(200).json({ status: "success", message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};




// Cancel order (User or Admin)
export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    // Only user who placed order or admin can cancel
    if (req.userId !== order.userId.toString() && req.role !== "admin") {
      return res.status(403).json({ status: "error", message: "Forbidden: cannot cancel this order" });
    }

    // Only pending or confirmed orders can be canceled
    if (["shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({ status: "error", message: "Order cannot be canceled now" });
    }

    order.status = "canceled";
    await order.save();

    return res.status(200).json({ status: "success", message: "Order canceled successfully", order });

  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};






// import { Order } from "../models/Order.js";
// export const getOrder = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const order = await Order.findById(id).populate([
//       {
//         path: 'products.productId',
//         model: 'Product'
//       }
//     ]);
//     return res.status(200).json({
//       status: 'success',
//       order
//     })
//   } catch (err) {
//     return res.status(500).json({
//       status: 'error',
//       message: err.message
//     })
//   }
// }


// export const getOrders = async (req, res) => {
//     try {
//         if(req.role === 'admin'){
//             const orders = await Order.find({}).populate([
//                 {
//                     path: 'products.productId',
//                     model:'Product'
//                 },

//                 {
//                     path: 'userId',
//                     model: 'User',
//                     select: '-password'
//                 }
//             ]);

//             return res.status(200).json({
//                 status: 'success',
//                 orders
//             });

//         }else{
//             const orders = await Order.find({userId: req.userId}).populate
//             ([
//                 {
//                     path: 'products.productId',
//                     model: 'Product'
//                 },
                
//                 {
//                     path:'userId',
//                     model: 'User',
//                     select: '-password'
//                 }
//             ]);

//             return res.status(200).json({
//                 status: 'success',
//                 orders
//             })
//         }
//     } catch (err) {
//         return res.status(500).json({
//             status: 'error',
//             message: err.message
//         })
        
//     }
// }

// export const createOrder = async (req, res) => {
//     const {totalAmount, products, billingDetails,paymentMethod} = req.body ?? [];
//     try {
//        const order = await Order.create({
//             totalAmount,
//             userId : req.userId, // from checkUser middlware
//             products,
//             billingDetails,
//             paymentMethod
//         });

//         return res.status(201).json({
//             status: 'success',
//             message: 'order created successfully',
//             order
//         })

//     } catch (err) {
//         return res.status(500).json({
//             status: 'error',
//             message: err.message
//         })
//     }
// }




// // Update order status (admin only)
// export const updateOrderStatus = async (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;

//   if (req.role !== "admin") {
//     return res.status(403).json({ status: "error", message: "Forbidden: admin only" });
//   }

//   const allowedStatus = ["pending", "confirmed", "shipped", "delivered"];
//   if (!allowedStatus.includes(status)) {
//     return res.status(400).json({ status: "error", message: "Invalid status value" });
//   }

//   try {
//     const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
//     if (!order) return res.status(404).json({ status: "error", message: "Order not found" });

//     return res.status(200).json({ status: "success", message: "Order status updated", order });
//   } catch (err) {
//     return res.status(500).json({ status: "error", message: err.message });
//   }
// };