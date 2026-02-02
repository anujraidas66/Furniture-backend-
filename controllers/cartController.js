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

        //find user  and specific cart data
        const userId = req.user._id;
        const cart = await User.findOne({_id: userId}).select("cart");
        
        if(!cart){
            const newCart = await Cart.create({
                user: userId,
                product: [product._id],
                // $inc: {
                //     items:1,
                //     totalPrice: product.prices
                // }
            });
        }

        // means user k pass cart nahi hai then new cart create kar rahe hai
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


// get cart (fetch total from the cart)
export const getCart = async (req, res) => {
    try {
        //find user id  user id use karke cart v find karna
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




// taste code from github


// import User from "../models/user.model.js";
// import Cart from "../models/cart.model.js";
// import Product from "../models/product.model.js";

// // Here TODO: Problem Hai
// export const addToCart = async (req, res) => {
//     try{

//         // find Product Id
//         const { productId } = req.body;

//         if(!productId){
//             return res.status(400).json({
//                 message : "Please fill all fields"
//             });
//         }

//         // find Product
//         const product = await Product.findById(productId);
//         // console.log(Number(product.prices));

//         if(!product){
//             return res.status(400).json({
//                 message : "Product not found"
//             });
//         }


//         // here Fixed the problem
//         const userId = req.user.id;
//         // console.log(userId);

//         const user = await User.findById(userId);
//         // console.log(user);

//         console.log(user);

//         if(!user){
//             return res.status(400).json({
//                 message : "User not found"
//             });
//         }

//         const cart = await Cart.findOne({ user: userId });
//         // console.log(cart);

//         // TODO: check if product is already in cart
//         if(!cart){
//             const newCart = await Cart.create({
//                 user : userId,
//                 products :[
//                     {
//                         productId : product._id,
//                         name : product.name,
//                         price : Number(product.prices),
//                         image : Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl,
//                         quantity : 1
//                     },
//                 ],
//                 totalPrice : Number(product.prices)
//             });


//             // after adding Product to cart then update the user
//             await User.findByIdAndUpdate(user._id, {
//                 $set : {
//                     cart : newCart._id
//                 }
//             });

//             return res.status(200).json({
//                 message : "Product added to cart successfully",
//                 cart : newCart
//             });
//         }

//         const existingProduct = cart.products.find(product => product.productId.toString() === productId);

//         if(existingProduct){
//             existingProduct.quantity += 1;
//         }else{
//             cart.products.push({
//                 productId : product._id,
//                 name : product.name,
//                 price : Number(product.prices),
//                 image : Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl,
//                 quantity : 1
//             });
//         }

//         cart.totalPrice += Number(product.prices);
//         await cart.save();

//         await User.findByIdAndUpdate(user._id, {
//             $set: {
//                 cart : cart._id
//             }
//         });

//         // console.log(updatedCart);

//         return res.status(200).json({
//             message : "Product added to cart successfully",
//             cart : cart
//         });
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).json({
//             message : "Internal server error"
//         });
//     }
// }

// export const getCart = async (req, res) => {
//     try{
//         // find user Id
//         const userId = req.user.id;

//         const user = await User.findById(userId);
//         console.log(user);

//         if(!user){
//             return res.status(400).json({
//                 message : "User not found"
//             });
//         }

//         const cart = await Cart.findOne({ user: userId });

//         if(!cart){
//             return res.status(400).json({
//                 message : "Cart not found"
//             });
//         }

//         return res.status(200).json({
//             message : "Cart fetched successfully",
//             cart
//         });
//     }

//     catch(err){
//         console.log(err);
//         return res.status(500).json({
//             message : "Internal server error"
//         });
//     }
// }

// // export const removeFromCart = async (req, res) => {
// //     try{
// //         const { productId } = req.body;

// //         if(!productId){
// //             return res.status(400).json({
// //                 message : "Please fill all fields"
// //             });
// //         }

// //         const product = await Product.findById(productId);

// //         if(!product){
// //             return res.status(400).json({
// //                 message : "Product not found"
// //             });
// //         }

// //         const userId = req.user.id;
// //         const cart = await User.findOne({ _id : userId }).select("cart");

// //         if(!cart){
// //             return res.status(400).json({
// //                 message : "Cart not found"
// //             });
// //         }

// //         const updateCart = await Cart.findOneAndUpdate(
// //             { user : userId },
// //             {
// //                 $pull : {
// //                     product : product._id
// //                 }
// //             }
// //         );

// //         if(!updateCart){
// //             return res.status(400).json({
// //                 message : "Cart not found"
// //             });
// //         }

// //         // not remove after delete all product from cart
// //         await User.findByIdAndUpdate(userId, {
// //             $unset : {
// //                 cart : cart._id
// //             }
// //         });
        
// //         return res.status(200).json({
// //             message : "Product removed from cart successfully",
// //             cart : updateCart
// //         });
// //     }
// //     catch(err){
// //         console.log(err);
// //         return res.status(500).json({
// //             message : "Internal server error"
// //         });
// //     }
// // }

// export const removeFromCart = async (req, res) => {
//   try {
//     const { productId } = req.body;

//     if (!productId) {
//         return res.status(400).json({ 
//             message: "Please provide productId" 
//         });
//     }

//     const userId = req.user.id;
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//         return res.status(404).json({ 
//             message: "Cart not found" 
//         });
//     }

//     // Find the product in cart
//     const productIndex = cart.products.findIndex(
//         (item) => item.productId.toString() === productId
//     );

//     if (productIndex === -1) {
//         return res.status(404).json({ 
//             message: "Product not found in cart" 
//         });
//     }

//     // Update total price before removing
//     const removedProduct = cart.products[productIndex];
//     cart.totalPrice -= removedProduct.price * removedProduct.quantity;

//     // Remove product from cart
//     cart.products.splice(productIndex, 1);

//     await cart.save();

//     // If cart is empty, unset from user
//     if (cart.products.length === 0) {
//         await User.findByIdAndUpdate(userId, 
//             { 
//                 $unset: { 
//                     cart: null
//                 } 
//         });
//     }

//     return res.status(200).json({
//         message: "Product removed from cart successfully",
//         cart,
//     });

//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };