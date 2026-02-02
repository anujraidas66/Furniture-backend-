import mongoose from 'mongoose';

const RatingAndReviewSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },

    rating : [
        {
            type : Number,
            default : 0
        }
    ],

    review : [{
        type : String,
        required : true
    }]
}, {
    timestamps : true
})

const RatingAndReview = mongoose.model('RatingAndReview', RatingAndReviewSchema);
export default RatingAndReview;