import { Order } from "../models/Order.js";
export const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate([
      {
        path: 'products.productId',
        model: 'Product'
      }
    ]);
    return res.status(200).json({
      status: 'success',
      order
    })
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message
    })
  }
}


export const getOrders = async (req, res) => {
    try {
        if(req.role === 'admin'){
            const orders = await Order.find({}).populate([
                {
                    path: 'products.productId',
                    model:'Product'
                },

                {
                    path: 'userId',
                    model: 'User',
                    select: '-password'
                }
            ]);

            return res.status(200).json({
                status: 'success',
                orders
            });

        }else{
            const orders = await Order.find({userId: req.userId}).populate
            ([
                {
                    path: 'products.productId',
                    model: 'Product'
                },
                
                {
                    path:'userId',
                    model: 'User',
                    select: '-password'
                }
            ]);

            return res.status(200).json({
                status: 'success',
                orders
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}

export const createOrder = async (req, res) => {
    const {totalAmount, products, billingDetails,paymentMethod} = req.body ?? [];
    try {
       const order = await Order.create({
            totalAmount,
            userId : req.userId, // from checkUser middlware
            products,
            billingDetails,
            paymentMethod
        });

        return res.status(201).json({
            status: 'success',
            message: 'order created successfully',
            order
        })

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}




// Update order status (admin only)
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

    return res.status(200).json({ status: "success", message: "Order status updated", order });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};