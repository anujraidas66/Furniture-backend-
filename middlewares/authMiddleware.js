import jwt from 'jsonwebtoken';

// authmiddleware check garxha user login xha ki nai
export const authMiddleware = (req,res,next) =>{

    try {
    const token = req.headers.authorization;

    if(!token) return res.status(401).json({
        status: 'error',
        message: 'please login first'
    })

    // user decode have already set role,email and password
    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;
        next();
        
    } catch (err) {
        return res.status(401).json({
        status: 'error',
        message: err.message
        });
    }
    } catch (err) {
         return res.status(401).json({
        status: 'error',
        message: err.message
     });
    }
}


// i have replace sellerauthenticate to adminauthenticate
export const adminAuthenticate = async(req, res) => {
    try {
        if(req.user.role !== 'admin') return res.status(401).json({
            status: 'error',
            message: 'you are not admin'
        });
        next();
    } catch (err) {
        return res.status(401).json({
            status: 'error',
            message: err.message
         });
        
    }
}