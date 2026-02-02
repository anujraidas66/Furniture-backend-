import Address from "../models/address.js";
import User from "../models/user.js";

export const updateAddress = async(req, res) => {
    const {street, city, state, country, pincode, phone} = req.body ?? {};
    try {
        // user le address lai update garxha
        const userId = req.user._id;
                // const userId = req.user.id;

        if(!street || !city || !state || !country || !pincode || !phone){
            return res.status(400).json({
                status: 'error',
                message: 'all fields are required'
            })
        }


        // find user
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({
            status: 'error',
            message: 'user not found'
        });

       
        //update user address
        const updateUser = await Address.findOneAndUpdate({
            user: user._id
        },

        // these data update data under database
        {
            $set: {
                street, city, state, country, pincode, phone
            }
        },{
            new:true
        }).select("-password");

        return res.status(200).json({
            message: "address updated successfully",
            data: updateUser
        })

    } catch (err) {
        return res.status(500).json({
            status: 'error',
             message: err.message})
    }
}


