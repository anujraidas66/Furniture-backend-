import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true ,
        unique : true
    },

    image : {
        type : String,
    },

    phone : {
        type : String,
        required : true
    },

    role : {
        type : String,
        required: true,
        default : "user",
        enum : ["admin",  "user"],
    },

    // change here
    cart : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cart'
    },

    orders : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Order'
        }
    ],

    address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Address',
        default : null
    },

    product : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product'
        }
    ],

    password : {
        type : String,
        required : true
    },
}, {
    timestamps : true
})

const User = mongoose.model("User", userSchema);
export default User;