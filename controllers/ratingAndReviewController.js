import Product from "../models/product.js";
import RatingAndReview from "../models/ratingAndReview.js";
import User from "../models/user.js";

// create a rating and review those who are login 
export const createRatingAndReview = async (req, res)=> {
    try {
        const userId = req.user._id;
        const productId = req.body.productId;
        //rating comes in number form
        const rating = req.body.rating;
        // review come in text form
        const review = req.body.review;

        if(!productId){
            return res.status(400).json({
                status: 'error',
                message: 'please product id is required'
            })
        }

        if(!rating && !review){
            return res.status(400).json({
                status: 'error',
                message: 'rating and review is required'
            });
        };

        // const user = await User.findById(userId);

        // if(!user){
        //     return res.status(404).json({
        //         status: 'error',
        //         message: 'user not found'
        //     });
        // }

        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({
                status: 'error',
                message: 'product not found'
            });
        }

        const newRatingAndReciew = await RatingAndReview.create({
            user: userId,
            product: productId,
            rating:rating,
            review: review
        })

        return res.status(201).json({
            message: 'rating and review created successfully',
            ratingAndReview: newRatingAndReciew
        })

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}

//fetch all rating and reviews login are not required
export const getAllRatingAndReview = async (req, res) => {
   try {
    const getAllRatingAndReview = await RatingAndReview.find().populate("product").populate("user");
   
    if(!getAllRatingAndReview){
        return res.status(404).json({
            status: 'error',
            message: 'rating and review not found'
        })
    }

    return res.status(200).json({
        message: 'rating and review fetched successfully',
        ratingAndReview: getAllRatingAndReview
    })

   } catch (err) {
    return res.status(500).json({
        status: 'error',
        message: err.message
    })
   }
}