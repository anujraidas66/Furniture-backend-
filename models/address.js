import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

    street : {
        type : String,
    },

    city : {
        type : String,
    },

    state : {
        type : String,
    },

    zip : {
        type : String,
    },

    country : {
        type : String,
    }
});

const Address = mongoose.model("Address", addressSchema);
export default Address;