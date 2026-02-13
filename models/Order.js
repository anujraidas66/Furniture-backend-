// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({

//     totalAmount: {
//         type: Number,
//         required: true
//     },

//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },

// // Billing details is embedded inside order 
//      billingDetails: {
//       firstName: {
//         type: String,
//         required: true,
//       },

//       lastName: {
//         type: String,
//         required: true,
//       },

//       companyName:{
//         type: String,

//       },

//       country:{
//         type: String,
//         required: true
//       },

//       streetAddress: {
//         type: String,
//         required: true,
//       },

//       city: {
//         type: String,
//         required: true,
//       },

//       phone: {
//         type: String,
//         required: true,
//       },

//       province:{
//         type: String,
//         enum:['koshi','baghmati', 'madesh', 'lumbini','sudurpachhim', 'gandaki','karnali'],
//         required: true
//       },

//       zipCode: {
//         type: String,
//         required: true,
//       },

//       email: {
//         type: String,
//         required: true
//       },
      
//       comment:{
//         type: String,
//         required: true
//       }
//     },

  
// products: {
    
//     type:[{
//         productId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Product',
//             required: true
//         },

//         quantity: {
//             type:Number,
//             required: true
//         }
//     },

// ],
//   required:true,
//   // object dine and tehi object ma yauta function dine ani v bhane ko array ko so v ko length greater then 0 xha bhane validation true hunxha mean crate order 
//   validate: {
//     validator: function (v) {
//         return v.length > 0;
//     },

//     message : 'Order must cantain at least one product.'
//   },


//   status: {
//       type: String,
//       enum: ["pending", "confirmed", "shipped", "delivered"],
//       default: "pending",
//     },


//     paymentMethod: {
//     type: String,
//     enum: ["Direct Bank", "Cash on Delivery"],
//     required: true
//   }

// },

// }, {timestamps: true});

// export const Order = mongoose.model('Order', orderSchema);




import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Billing details
  billingDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String },
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    province: {
      type: String,
      enum: ["koshi", "baghmati", "madesh", "lumbini", "sudurpachhim", "gandaki", "karnali"],
      required: true
    },
    zipCode: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String }
  },

  // Products array
  products: {
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
      }
    ],
    
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "Order must contain at least one product"
    }
  },

  // Status - top level
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "canceled"],
    default: "pending"
  },

  // Payment method - top level
  paymentMethod: {
    type: String,
    enum: ["Direct Bank Transfer", "Cash on Delivery"],
    required: true
  }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
