import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({ 
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

    products : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product'
            },
            quantity : {
                type : Number,
                default : 1
            },
            price : {
                type : Number
            }
        }
    ],

    totalPrice : {
        type : Number,
        required : true
    },

    status : {
        type : String,
        enum : ["Pending", "Shipped", "Delivered", "Cancelled"],
        default : "Pending"
    }
})

const Order = mongoose.model('Order', OrderSchema);
export default Order;