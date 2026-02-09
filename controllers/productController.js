import Product from "../models/product.js"
import fs from 'fs';
export const getProducts = async (req, res) => {
    try {
       const products =  await Product.find({});
        return res.status(200).json({
            status: 'success',
            products
        })

    } catch (err) {
        return res.status(400).json({
            status: 'error',
            data: err.message
        })
        
    }
}


export const getProduct = async (req, res) => {
   try {
    const isExist = await Product.findById(req.id);
    if(!isExist) return res.status(404).json({
        status: 'error',
        data: "product not found"
    })

    return res.status(200).json({
        status:'success',
        product:isExist
    })
   } catch (err) {
    return res.status(400).json({
        status:'error',
        message: err.message
    })
   }
}

export const createProduct = async (req, res) => {
    const {title,description,price,category,color,size,rating,stock} = req.body ?? {};
 
    try {
        await Product.create({
            title,
            description,
            price,
            category,
            color,
            size,
            image:req.imagePath,
            rating,
            stock
        });

        return res.status(201).json({
            status: 'success',
            data: "product created successfully"
        })

    } catch (err) {

        fs.unlink(`./uploads/${req.imagePath}`,(error)=>{
            return res.status(400).json({
                status: 'error',
                message: err.message
            })
        });    
      
    }
};


export const updateProduct = async (req, res) => {
const {title,description,price,category,color,size,rating,stock} = req.body ?? {};
  try {

    //purano data fetch gareko isExist ma yadi purano kehi chahiyeo bhane isExist.image, isExist,title etc
    const isExist = await Product.findById(req.id);
    if (!isExist) {
        // yadi id patayeo but kunai yata word ko thau ma arko bayeo bhane to 
      if (req.imagePath) {
        fs.unlinkSync(`./uploads/${req.imagePath}`);
        return res.status(404).json({ status: 'error', data: 'product not found' });
      } else {
        return res.status(404).json({ status: 'error', data: 'product not found' });
      }
    }

    isExist.title = title || isExist.title;
    isExist.price = price || isExist.price;
    isExist.description = description || isExist.description;
    isExist.category = category || isExist.category;
    isExist.stock = stock || isExist.stock;
    isExist.color = color || isExist.color;
    isExist.size = size || isExist.size;
    isExist.rating = rating || isExist.rating;

    await isExist.save();

    //updating file
    if (req.imagePath) {
      fs.unlink(`./uploads/${isExist.image}`, async (err) => {
        isExist.image = req.imagePath;
        await isExist.save();
        return res.status(200).json({
          status: 'success',
          data: 'product successfully updated'
        });

      })

    } else {
      return res.status(200).json({
        status: 'success',
        data: 'product successfully updated'
      });
    }


  } catch (err) {
    if (req.imagePath) {
      fs.unlink(`./uploads/${req.imagePath}`, (error) => {
        return res.status(500).json({
          status: 'error',
          message: err.message
        });
      })
    } else {
      return res.status(500).json({
        status: 'error',
        message: err.message
      });
    }

  }
}



export const deleteProduct = async (req, res) => {
  try {
    const isExist = await Product.findById(req.id);
    if(!isExist) return res.status(404).json({ status: 'error', data: 'product not found' });


    fs.unlink(`./uploads/${isExist.image}`, async (err) => {

      await isExist.deleteOne();
      return res.status(200).json({ status: 'success', data: 'product deleted successfully' })
    })

  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message
    });

  }
};


