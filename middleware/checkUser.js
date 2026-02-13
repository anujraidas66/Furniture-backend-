import jwt from 'jsonwebtoken';

// Verify user is logged in
export const checkUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, token missing'
    });
  }

  try {
    const decoded = jwt.verify(token, 'secret'); // use your JWT secret
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

// Verify user is admin
export const checkAdmin = (req, res, next) => {
  if (req.role === 'admin') return next();

  return res.status(403).json({
    status: 'error',
    message: 'You are not authorized as admin'
  });
};



// import jwt from 'jsonwebtoken';

// export const checkUser = (req,res,next) =>{
//     const token = req.headers.authorization;
//     if(!token) return res.status(401).json({
//         status: 'error',
//         message: 'unauthorized'
//     })
//     try {
    
//     const decode = jwt.verify(token,'secret');

//     req.userId = decode.id;
//     req.role = decode.role;
//     next();
//     } catch (err) {
//          return res.status(401).json({
//         status: 'error',
//         message: err.message
//      });
//     }
   
// }

// export  const checkAdmin = (req,res,next)=>{
//     if(req.role === 'admin') return next();
//     return res.status(401).json({
//         status: 'error',
//         message: 'you are not authorised'
//     })
// }