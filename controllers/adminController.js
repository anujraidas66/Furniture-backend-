import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerAdmin = async(req, res) => {
    const {name, email, password} = req.body ?? {}
    try {
        const admin = await Admin.findOne({email});

        if(admin) return res.status(400).json({
            status: 'error',
            message: 'email already exists'
        })

        const hashPass = bcrypt.hashSync(password,10);
        await Admin.create({
            name,
            email,
            password: hashPass
        })

        //create token

        const payload = {
            id: admin._id,
            email: admin.email,
            role: admin.role
        };

        const token = jwt.sign(payload, 'secret');

        return res.status(201).json({
           message: 'admin successfully registered',
           admin: admin,
           token
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}


export const adminLogin = async (req, res) => {
    const {email, password} = req.body ?? {};
    try {
        const admin = await Admin.findOne({email});

        if(!admin) return res.status(404).json({
            status: 'error',
            message: 'admin not found'
        })

        const isPassCorrect = bcrypt.compareSync(password, admin.password);

        if(!isPassCorrect) return res.status(400).json({
            status: 'error',
            message: 'invalid credential'
        })

        // create TOKEN

        const payload = {
            id: admin._id,
            email: admin.email,
            role: admin.role
        };

        const token = jwt.sign(payload, 'secret');

        return res.status(200).json({
           message: 'admin successfully logged in',
           admin: admin,
           token
        })
    } catch (err) {
        return res.satus(500).json({
            status: 'error',
            message: err.message
        })
    }
}


export const getAdmin = async (req, res) => {
    try {
        const adminId = req.user._id;
        if(!adminId) return res.status(400).json({
            status: 'error',
            message: 'unauthorized'
        });

        const admin = await Admin.findById(adminId);

        if(!admin) return res.status(400).json({
            status: 'error',
            message: 'admin not found'
        });

        return res.status(200).json({
            message: 'admin fetched successfully',
             admin
        })
    
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}