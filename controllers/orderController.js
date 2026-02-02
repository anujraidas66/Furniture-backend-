

//create a new order

import Order from "../models/order.js";
import User from "../models/user.js";

// get a single order

export const getSingleOrder = async(req, res) => {
    try {
        const orderId = req.params.id;

        if(!orderId){
            return res.status(400).json({
                status: 'error',
                message: 'order id is required'
            })
        }

        const order = await Order.findById(orderId).populate("user").populate("products");

        if(!order){
            return res.status(400).json({
                status: 'error',
                message: 'order not found'
            })
        }

        return res.status(200).json({
            message: 'order fetched successfully',
            order: order
        })

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}


// get all order
export const getAllOrders = async (req, res) => {
    try {
        const allOrders = await Order.find().populate("user").populate("products");

        if(!allOrders){
            return res.status(404).json({
                status: 'error',
                message: 'orders not found'
            })
        }

        return res.status(200).json({
            message: 'orders fetched successfully',
            orders: allOrders
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const products = req.body.products;

        if(!products){
            return res.status(400).json({
                status: 'error',
                message: 'products are required'
            })
        }

        const user  = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            })
        }

        const newOrder = await Order.create({
            user: userId,
            products: products,
            totalPrice: products.reduce((acc, curr)=> acc + curr.price, 0),
            status: 'pending'
        });

        return res.status(201).json({
            message: 'order created successfully',
            order: newOrder
        })

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}


//update an order
export const updateOrder = async(req, res) => {
    try {
        const orderId = req.params.id;
        const status = req.body.status;

        if(!orderId){
            return res.status(400).json({
                status: 'error',
                message: 'order id is required'
            })
        }

        if(!status){
            return res.status(400).json({
                status: 'error',
                message: 'status is required'
            })
        }

        // const order = await Order.findById(orderId);

        // if(!order){
        //     return res.status(404).json({
        //         status: 'error',
        //         message: 'order not found'
        //     })
        // }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, 
            {status: status});

            if(!updatedOrder){
                return res.status(404).json({
                    status: 'error',
                    message: 'order not updated'
                })
            }

            return res.status(200).json({
                message: 'order updated successfully',
                order: updatedOrder
            });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}

//cancel an order
export const cancelOrder = async(req, res) =>{
    try {
        const orderId = req.params.id;
        if(!orderId){
            return res.status(400).json({
                status: 'error',
                message: 'order id is required'
            })
        }

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({
                status: 'error',
                message: 'order not found'
            })
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, 
            {status: 'cancelled'});

            if(!updatedOrder){
                return res.status(404).json({
                    status: 'error',
                    message: 'order not updated'
                })
            }

            if(!updatedOrder){
                return res.status(404).json({
                    status: 'error',
                    message: 'order not updated'
                })
            }

            return res.status(200).json({
                message: 'order cancelled successfully',
                order: updatedOrder
            });
            
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}


// deliver an order 
//delete an order