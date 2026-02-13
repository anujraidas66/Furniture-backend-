import Product from "../models/product.js";
import fs from "fs";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ status: "success", products });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// GET single product by ID
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.id);
    if (!product)
      return res.status(404).json({ status: "error", message: "Product not found" });

    return res.status(200).json({ status: "success", product });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// GET products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    if (!products.length)
      return res.status(404).json({ status: "error", message: "No products found in this category" });

    return res.status(200).json({ status: "success", results: products.length, products });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/// Create Product
export const createProduct = async (req, res) => {
    const { title, description, price, category, colors, sizes, stock } = req.body;

    try {
        const product = await Product.create({
            title,
            description,
            price,
            category,
            stock,
            colors: JSON.parse(colors), // colors array
            sizes: JSON.parse(sizes),   // sizes array
            image: req.imagePaths,      // multiple images
        });

        return res.status(201).json({ status: 'success', data: 'Product created successfully', product });
    } catch (err) {
        // Remove uploaded files if creation fails
        if (req.imagePaths) {
            req.imagePaths.forEach(file => fs.unlinkSync(`./uploads/${file}`));
        }
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    const { title, description, price, category, colors, sizes, stock } = req.body;

    try {
        const product = await Product.findById(req.id);
        if (!product) {
            if (req.imagePaths) req.imagePaths.forEach(file => fs.unlinkSync(`./uploads/${file}`));
            return res.status(404).json({ status: 'error', data: 'Product not found' });
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.colors = colors ? JSON.parse(colors) : product.colors;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;

        // Replace images if new ones uploaded
        if (req.imagePaths?.length) {
            // remove old images
            product.image.forEach(file => fs.unlinkSync(`./uploads/${file}`));
            product.image = req.imagePaths;
        }

        await product.save();
        return res.status(200).json({ status: 'success', data: 'Product updated successfully', product });

    } catch (err) {
        if (req.imagePaths) req.imagePaths.forEach(file => fs.unlinkSync(`./uploads/${file}`));
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.id);
    if (!product) return res.status(404).json({ status: "error", message: "Product not found" });

    // Delete images
    if (product.image && product.image.length) {
      product.image.forEach((img) => {
        if (fs.existsSync(`./uploads/${img}`)) fs.unlinkSync(`./uploads/${img}`);
      });
    }

    await product.deleteOne();
    return res.status(200).json({ status: "success", message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};





// import Product from "../models/product.js"
// import fs from 'fs';
// export const getProducts = async (req, res) => {
//     try {
//        const products =  await Product.find({});
//         return res.status(200).json({
//             status: 'success',
//             products
//         })

//     } catch (err) {
//         return res.status(400).json({
//             status: 'error',
//             data: err.message
//         })
        
//     }
// }


// export const getProduct = async (req, res) => {
//    try {
//     const isExist = await Product.findById(req.id);
//     if(!isExist) return res.status(404).json({
//         status: 'error',
//         data: "product not found"
//     })

//     return res.status(200).json({
//         status:'success',
//         product:isExist
//     })
//    } catch (err) {
//     return res.status(400).json({
//         status:'error',
//         message: err.message
//     })
//    }
// }

// // Get products by category
// export const getProductsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;

//     const products = await Product.find({ category });

//     if (!products.length) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'No products found for this category'
//       });
//     }

//     res.status(200).json({
//       status: 'success',
//       results: products.length,
//       products
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// };

// export const createProduct = async (req, res) => {
//     const {title,description,price,category,color,size,rating,stock} = req.body ?? {};
 
//     try {
//         await Product.create({
//             title,
//             description,
//             price,
//             category,
//             color,
//             size,
//             image:req.imagePath,
//             rating,
//             stock
//         });

//         return res.status(201).json({
//             status: 'success',
//             data: "product created successfully"
//         })

//     } catch (err) {

//         fs.unlink(`./uploads/${req.imagePath}`,(error)=>{
//             return res.status(400).json({
//                 status: 'error',
//                 message: err.message
//             })
//         });    
      
//     }
// };


// export const updateProduct = async (req, res) => {
// const {title,description,price,category,color,size,rating,stock} = req.body ?? {};
//   try {

//     //purano data fetch gareko isExist ma yadi purano kehi chahiyeo bhane isExist.image, isExist,title etc
//     const isExist = await Product.findById(req.id);
//     if (!isExist) {
//         // yadi id patayeo but kunai yata word ko thau ma arko bayeo bhane to 
//       if (req.imagePath) {
//         fs.unlinkSync(`./uploads/${req.imagePath}`);
//         return res.status(404).json({ status: 'error', data: 'product not found' });
//       } else {
//         return res.status(404).json({ status: 'error', data: 'product not found' });
//       }
//     }

//     isExist.title = title || isExist.title;
//     isExist.price = price || isExist.price;
//     isExist.description = description || isExist.description;
//     isExist.category = category || isExist.category;
//     isExist.stock = stock || isExist.stock;
//     isExist.color = color || isExist.color;
//     isExist.size = size || isExist.size;
//     isExist.rating = rating || isExist.rating;

//     await isExist.save();

//     //updating file
//     if (req.imagePath) {
//       fs.unlink(`./uploads/${isExist.image}`, async (err) => {
//         isExist.image = req.imagePath;
//         await isExist.save();
//         return res.status(200).json({
//           status: 'success',
//           data: 'product successfully updated'
//         });

//       })

//     } else {
//       return res.status(200).json({
//         status: 'success',
//         data: 'product successfully updated'
//       });
//     }


//   } catch (err) {
//     if (req.imagePath) {
//       fs.unlink(`./uploads/${req.imagePath}`, (error) => {
//         return res.status(500).json({
//           status: 'error',
//           message: err.message
//         });
//       })
//     } else {
//       return res.status(500).json({
//         status: 'error',
//         message: err.message
//       });
//     }

//   }
// }



// export const deleteProduct = async (req, res) => {
//   try {
//     const isExist = await Product.findById(req.id);
//     if(!isExist) return res.status(404).json({ status: 'error', data: 'product not found' });


//     fs.unlink(`./uploads/${isExist.image}`, async (err) => {

//       await isExist.deleteOne();
//       return res.status(200).json({ status: 'success', data: 'product deleted successfully' })
//     })

//   } catch (err) {
//     return res.status(500).json({
//       status: 'error',
//       message: err.message
//     });

//   }
// };


