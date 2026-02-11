import { Order } from "../models/Order.js";

export const getOrders = async (req, res) => {
    try {
        const orders =  await Order.find({}).populate([
           {
            path:'userId',
            model:'User',
            select:('-password')
           },

           {
            path: 'products.productId',
            model: 'Product'
           }

        ]);
        return res.status(200).json({
            status:'sucess',
            orders
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}

export const createOrder = async (req, res) => {
    const {totalAmount, userId, products} = req.body ?? {};
    try {
        await Order.create({
            totalAmount,
            userId : req.userId,
            products
        });

        return res.status(201).json({
            status: 'success',
            message: 'order created successfully'
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}