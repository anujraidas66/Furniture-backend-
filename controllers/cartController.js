import Cart from "../models/cart.js";
import Product from "../models/product.js";
import User from "../models/user.js";

export const addToCart = async (req, res) => {
    const {productId} = req.body ?? {};
    try {
        if(!productId){
            return res.status(400).json({
                status: 'error',
                message: 'product id is required'
            })
        }

        //find product using product id
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                status: 'error',
                message: 'product not found'
            })
        }

        const userId = req.user._id;
        const cart = await User.findOne({_id: userId}).select("cart");
        
        if(!cart){
            const newCart = await Cart.create({
                user:userId,
                product: [product._id],
                // $inc: {
                //     items:1,
                //     totalPrice: product.prices
                // }
            });
        }

        return res.status(200).json({
            message: "product added to cart successfully",
            cart:newCart
        });

        const updateCart = await Cart.findOneAndUpdate({
            user: userId
        },{
            $push:{
                product: product._id
            }
        },{
            new: true
        });

        return res.status(200).json({
            message: "product added to cart successfully",
            cart:updateCart
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}



export const getCart = async (req, res) => {
    try {
        //find user id
        const userId = req.user._id;
        const cart = await User.findOne({_id :userId}).select("cart");

        if(!cart) return res.status(400).json({
            status: 'error',
            message: 'cart not found'
        });
        
        return res.status(200).json({
            message: "cart found successfully",
            cart
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}


export const removeFromCart = async (req, res) => {
    const {productId} = req.body ?? {};
    try {
        if(!productId){
            return res.status(400).json({
                status: 'error',
                message: 'product id is required'
            })
        }

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                status: 'error',
                message: 'product not found'
            })
        }

        const userId = req.user._id;
        const cart = await User.findOne({_id: userId}).select("cart");

        if(!cart){
            return res.status(404).json({
                status: 'error',
                message: 'cart not found'
            })
        }

        const updateCart = await Cart.findOneAndUpdate({
            user: userId
        },{
            $pull:{
                product: product._id
            }
        },{
            new: true
        });

        return res.status(200).json({
            message: "product removed from cart successfully",
            cart:updateCart
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}