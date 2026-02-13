import mongoose from 'mongoose';

export const checkId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid product ID'
    });
  }

  req.id = id;
  next();
};




// import mongoose from 'mongoose';

// export const checkId = (req,res,next)=>{
//   const { id } = req.params;
//   if(!mongoose.isValidObjectId(id)){
//     return res.status(400).json({status:'error', message:'Please provide valid product id'});
//   }
//   req.id = id;
//   next();
// };
