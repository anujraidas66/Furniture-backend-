import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    totalAmount: {
        type: Number,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

  
products: {
    
    type:[{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },

        quantity: {
            type:Number,
            required: true
        }
    }
],
  required:true,
  // object dine and tehi object ma yauta function dine ani v bhane ko array ko so v ko length greater then 0 xha bhane validation true hunxha mean crate order 
  validate: {
    validator: function (v) {
        return v.length > 0;
    },

    message : 'Order must cantain at least one product.'
  }
},

}, {timestamps: true});

export const Order = mongoose.model('Order', orderSchema);