
import mongoose from  'mongoose';

const productSchema =  new mongoose.Schema({

    title:{
        type:String,
        unique:true,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    image:[
        {
            type:String,
            required:true
        }
    ],

    stock:{
        type:Number,
        default:0
    },

    category:{
        type:String,
        required:true
    },

    color:{
        type:String,
        enum:['red','green','blue'],
        required:true
    },

    size:{
        type:String,
        enum:['small','medium','large'],
        required:true
    },

},{timestamps:true});


const Product = mongoose.model('Product',productSchema);
export default Product;