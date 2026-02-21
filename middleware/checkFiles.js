import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const supportedExts = ['.png', '.jpg', '.jpeg', '.gif'];

export const checkFile = async (req, res, next) => {
    try {
        const files = req.files?.images;
        if (!files)
            return res.status(400).json({
                status: 'error',
                data: 'Please provide image'
            });

        const imagesArray = Array.isArray(files) ? files : [files];
        const imagePaths = [];

        for (let file of imagesArray) {
            const ext = extname(file.name).toLowerCase();

            if (!supportedExts.includes(ext))
                return res.status(400).json({
                    status: 'error',
                    data: 'Invalid file type'
                });

            const imagePath = `${uuidv4()}-${file.name}`;
            await file.mv(`./uploads/${imagePath}`);
            imagePaths.push(imagePath);
        }

        req.imagePaths = imagePaths;
        next();

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};


// For update: optional images
export const updateCheckFile = (req, res, next) => {
    const files = req.files?.images;
    if (!files) return next();

    const imagesArray = Array.isArray(files) ? files : [files];
    const imagePaths = [];

    for (let file of imagesArray) {
        const ext = path.extname(file.name);
        if (!supportedExts.includes(ext)) return res.status(400).json({ status: 'error', data: 'Invalid file type' });

        const imagePath = `${uuidv4()}-${file.name}`;
        file.mv(`./uploads/${imagePath}`, (err) => {
            if (err) return res.status(500).json({ status: 'error', message: err.message });
        });
        imagePaths.push(imagePath);
    }

    req.imagePaths = imagePaths;
    next();
};




// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// const supportedExts = ['.png', '.jpg', '.jpeg', '.gif'];


// export const checkFile = (req, res, next) => {
//     const file = req.files?.image;
//     //checking files
//     if(!file) return res.status(400).json({
//         status: 'Error',
//         data: 'Please Provide image'
// });
// const fileExts = path.extname(file.name);

// //checking valid imageFile
// if(!supportedExts.includes(fileExts))return res.status(400).json({
//         status: 'Error',
//         data: 'Please provide valid image file'
// });
 
// const imagePath = `${uuidv4()}-${file.name}`;
// file.mv(`./uploads/${imagePath}`, (err)=>{
//     req.imagePath = imagePath;
//     next();
// })
    
// }






// export const updateCheckFile = (req, res, next) => {
//     const file = req.files?.image;
//     //checking files
//     if(!file) return next();
// const fileExts = path.extname(file.name);

// //checking valid imageFile
// if(!supportedExts.includes(fileExts))return res.status(400).json({
//         status: 'Error',
//         data: 'Please provide valid image file'
// });
 
// const imagePath = `${uuidv4()}-${file.name}`;
// file.mv(`./uploads/${imagePath}`, (err)=>{
//     req.imagePath = imagePath;
//     next();
// })
    
// }
