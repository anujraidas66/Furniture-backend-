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
    const {name, email,role, password} = req.body ?? {}
    try {
        if(!name || !email || !password) return res.status(400).json({
            status: 'error',
            message: 'all fields are required'
        });

        //check garxha jun mail send gardai xha tiyeo pahila nai register xha ki nai
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(400).json({
            status: 'error',
            message: 'user already exists'
        });

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            role,
            password: hashPassword
        });

        return res.status(201).json({
            message: 'user successfully registered',
            user
        });


    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}


//user get profile function like buyer
export const getProfile = async(req, res) => {
    const {id} = req.user;
    try {
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

export const UpdateProfile = async (req, res) => {
    const {name, email, role,phone} = req.user;
    try {
        const {id} = req.user;

        if(!id) return res.status(400).json({
            status: 'error',
            message: 'login first'
        });

        const user = await User.findById(id);

        if(!user) return res.status(404).json({
            status: 'error',
            message: 'user not found'
        });

        if(name){
            user.name = name;
        }

        if(email){
            user.email = email;
        }

        if(role){
            user.role = role;
        }
    
        if(phone){
            user.phone = phone;
        }

        await user.save();

        return res.status(200).json({
            message: "user profile updated successfully",
            user
        })

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}