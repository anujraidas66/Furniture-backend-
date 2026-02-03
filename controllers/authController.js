import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const {email, password} = req.body ?? {};
    try {
        if(!email || !password) return res.status(400).json({
            status: 'error',
            message: 'all fields are required'
        });

        //check garxha email pahila nai login xha ki
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({
            status: 'error',
            message: 'user not found'
        });

        const isPassCorrect = await bcrypt.compare(password, user.password);

        if(!isPassCorrect) return res.status(400).json({
            status: 'error',
            message: 'invalid credential'
        });


        //agar password and email correct milyeo bhane response send garnu bhanda pahila nai token create garne
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
        }, 'secret');

        return res.status(200).json({
            message: 'user successfully logged in',
            user,
            token
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}

export const register = async (req, res) => {
    try{

        const {name, email, role, password, phone} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message : "Please fill all the fields"
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message : "Email already exists"
            });
        }

        const passwordHash =  await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            role,
            phone,
            password : passwordHash
        });

        // create token 
        const payload = {
            id : user._id,
            role : user.role,
            email : user.email
        };

       const token = jwt.sign(payload, 'secret');
        return res.status(201).json({
            message : "User created successfully",
            user,
            token
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Internal server error"
        });
    }
}


//user get profile function like buyer
export const getProfile = async(req, res) => {
   
    try {
        const {id} = req.user;
        if(!id) return res.status(400).json({
            status: 'error',
            message: 'id is required'
        });

        //id paye paxi user model ma order, address,cart,product haru ko sath ma check garxha 
        const user = await User.findById(id).populate({
            path: "address",
            path: "cart",
            path:"orders",
            path:"product"
        }).select("-password"); // remove password

        if(!user){
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            })
        }

        return res.status(200).json({
            message: "user profile fetched successfully",
            user
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}

// export const updateProfile = async (req, res) => {
//     const {name, email, role,phone} = req.user ?? {};
//     try {
//         const {id} = req.user;

//         if(!id) return res.status(400).json({
//             status: 'error',
//             message: 'login first'
//         });

//         const user = await User.findById(id);

//         if(!user) return res.status(404).json({
//             status: 'error',
//             message: 'user not found'
//         });

//         if(name){
//             user.name = name;
//         }

//         if(email){
//             user.email = email;
//         }

//         if(role){
//             user.role = role;
//         }
    
//         if(phone){
//             user.phone = phone;
//         }

//         await user.save();

//         return res.status(200).json({
//             message: "user profile updated successfully",
//             user
//         })

//     } catch (err) {
//         return res.status(500).json({
//             status: 'error',
//             message: err.message
//         })
//     }
// }



export const updateProfile = async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const { id } = req.user;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        await user.save();

        user.password = undefined;

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




