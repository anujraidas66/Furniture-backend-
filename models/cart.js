import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    
    products : [
        {
            productId : {type : mongoose.Schema.Types.ObjectId, ref : 'Product'},
            name: String,
            price: Number,
            image: String,
            quantity: { type: Number, default: 1 }
        }
    ],

    totalPrice : {
        type : Number,
        default : 0
    }
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;