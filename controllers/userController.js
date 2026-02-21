import User from "../models/user.js"
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

export const loginUser = async (req, res) => {
  const { email, password } = req.body ?? {};
  try {
      const isExist = email ? await User.findOne({email}) : await User.findOne({username});
    if (!isExist) return res.status(404).json({
      status: 'error',
      data: 'user doesn\'t exist'
    });

    const pass = bcrypt.compareSync(password, isExist.password);

    if (!pass) return res.status(400).json({
      status: 'error',
      data: 'invalid credential'
    });
    
    const token = jwt.sign({
      id: isExist.id,
      role: isExist.role
    }, 'secret');
    return res.status(200).json({
      status: 'success',
      data: {
        token,
        role: isExist.role
      }
    });


  } catch (err) {
    return res.status(500).json({
      status: 'error',
      data: err.message
    });
  }
}


export const registerUser =async (req, res) => {

    const {email, password, username} = req.body ?? {};
    try {

        const hashPash = bcrypt.hashSync(password, 10);
        await User.create({
            email,
            password: hashPash,
            username
        });

        return res.status(201).json({
            status:'success',
            data: "user created successfully"
        });

    } catch (err) {
        return res.status(400).json({
            status:'error',
            data: err.message
        })
    }
}



// Forgot password → generate token and return it (no email)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Email is not registered",
      });
    }

    // Generate a token (expires in 10 mins)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 1000 * 60 * 10;
    await user.save();

    // Send token in response
    res.status(200).json({
      status: "success",
      message: "Reset token generated",
      resetToken,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Reset password using token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

    user.password = bcrypt.hashSync(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};




// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     //  If email not registered
//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "Email is not registered"
//       });
//     }

//     // generate token
//     const resetToken = crypto.randomBytes(32).toString("hex");

//     user.resetToken = resetToken;
//     user.resetTokenExpire = Date.now() + 1000 * 60 * 10;
//     await user.save();

//     const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

//     console.log("Reset Link:", resetUrl); // for testing


//     await transporter.sendMail({
//       to: email,
//       subject: "Reset Your Password",
//       html: `
//         <p>You requested a password reset.</p>
//         <p>Click here to reset your password:</p>
//         <a href="${resetUrl}">${resetUrl}</a>
//       `,
//     })

//     res.status(200).json({
//       status: "success",
//       message: "Reset link sent to your email"
//     });

//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: err.message
//     });
//   }
// };


// export const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpire: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid or expired token"
//       });
//     }

//     const hashedPassword = bcrypt.hashSync(password, 10);

//     user.password = hashedPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpire = undefined;

//     await user.save();

//     res.status(200).json({
//       status: "success",
//       message: "Password reset successful"
//     });

//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// };







// nodemailer 

// export const forgotPasswordg = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ status: "error", message: "Email is not registered" });

//     const resetToken = crypto.randomBytes(32).toString("hex");
//     user.resetToken = resetToken;
//     user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
//     await user.save();

//     const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Reset Your Password",
//       html: `
//         <p>You requested a password reset.</p>
//         <p>Click here to reset your password:</p>
//         <a href="${resetUrl}">${resetUrl}</a>
//         <p>This link expires in 10 minutes.</p>
//       `,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//     } catch (emailErr) {
//       return res.status(500).json({ status: "error", message: "Failed to send email: " + emailErr.message });
//     }

//     res.status(200).json({ status: "success", message: "Reset link sent to your registered email" });
//   } catch (err) {
//     res.status(500).json({ status: "error", message: err.message });
//   }
// };