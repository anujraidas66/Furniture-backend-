import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const supportedExts = ['.png', '.jpg', '.jpeg', '.gif'];


export const checkFile = (req, res, next) => {
    const file = req.files?.image;
    //checking files
    if(!file) return res.status(400).json({
        status: 'Error',
        data: 'Please Provide image'
});
const fileExts = path.extname(file.name);

//checking valid imageFile
if(!supportedExts.includes(fileExts))return res.status(400).json({
        status: 'Error',
        data: 'Please provide valid image file'
});
 
const imagePath = `${uuidv4()}-${file.name}`;
file.mv(`./uploads/${imagePath}`, (err)=>{
    req.imagePath = imagePath;
    next();
})
    
}

// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';

// const supportedExts = ['.png', '.jpg', '.jpeg', '.gif'];

// export const checkFile = (req, res, next) => {
//   const files = req.files?.image;

//   if (!files) {
//     return res.status(400).json({
//       status: 'Error',
//       data: 'Please provide image'
//     });
//   }

//   // FIX: define imageFiles
//   const imageFiles = Array.isArray(files) ? files : [files];

//   const imagePaths = [];

//   for (const file of imageFiles) {
//     const fileExt = path.extname(file.name).toLowerCase();

//     if (!supportedExts.includes(fileExt)) {
//       return res.status(400).json({
//         status: 'Error',
//         data: 'Please provide valid image file'
//       });
//     }

//     const imagePath = `${uuidv4()}-${file.name}`;
//     imagePaths.push(imagePath);

//     file.mv(`./uploads/${imagePath}`, (err) => {
//       if (err) {
//         return res.status(500).json({
//           status: 'Error',
//           data: 'Image upload failed'
//         });
//       }
//     });
//   }

//   req.imagePaths = imagePaths;
//   next();
// };



export const updateCheckFile = (req, res, next) => {
    const file = req.files?.image;
    //checking files
    if(!file) return next();
const fileExts = path.extname(file.name);

//checking valid imageFile
if(!supportedExts.includes(fileExts))return res.status(400).json({
        status: 'Error',
        data: 'Please provide valid image file'
});
 
const imagePath = `${uuidv4()}-${file.name}`;
file.mv(`./uploads/${imagePath}`, (err)=>{
    req.imagePath = imagePath;
    next();
})
    
}