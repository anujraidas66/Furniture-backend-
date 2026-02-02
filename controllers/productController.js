import Product from "../models/product.js";
import User from "../models/user.js";
import { fileUpload } from "../src/config/uploadCloudinary.js";

export const createProduct = async (req, res) => {

    const{name,prices,category,description,color,size,discount,stock} = req.body ?? {};

    try {

        const userId = req.user.id;

        if(!userId) return res.status(400).json({
            status: 'error',
            message: 'please login first'
        })

        if(!name || !prices || !category || !description || !color || !size || !discount || !stock) return res.status(400).json({
            status: 'error',
            message: 'all fields are required'
        });

        const images = req.files?.image;

        if(!images) return res.status(400).json({
            status: 'error',
            message: 'image is required'
        });

        // check if user exist under database
        const findUser = await User.findById(userId);

        if(!findUser) return res.status(404).json({
            status: 'error',
            message: 'user not found'
        });

        const imagesURL = await fileUpload(images);

        if(!imagesURL) return res.status(400).json({
            status: 'error',
            message: 'image upload failed'
        });

        const product = await Product.create({
            name,
            prices,
            category,
            description,
            color,
            size,
            discount,
            stock,
            imageUrl: imagesURL,
            user: findUser._id
        });

        return res.status(201).json({
            message: "product created successfully",
            product
        })

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}


export const updateProduct = async(req,res) =>{

const{name,prices,category,description,color,size,discount,stock,} = req.body ?? {};
   
   try {
    // PRODUCT ID
        const {id} = req.params;

        if(!id) return res.status(400).json({
            status: 'error',
            message: 'please provide product id'
        });
        
        // jun user update garxha tesko id
        const userId = req.user.id;
        if(!userId) return res.status(400).json({
            status: 'error',
            message: 'please login first/ unauthorized'
        });

        const product = await Product.findById(id);

        if(!product) return res.status(404).json({
            status: 'error',
            message: 'product not found'
        });

        const images = req.files.image;
        if(images){
            const imagesURL = await fileUpload(images);
            product.imageUrl = imagesURL;
        }

        // userid and product id match bhayeo bhane matrai update garna mixha

        if(userId !== product.user.toString()){
            return res.status(401).json({
                status: 'error',
                message: 'unauthorized'
            })
        }

        if(name){
            product.name = name;
        }

        if(prices){
            product.prices = prices;
        }

        if(category){
            product.category = category;
        }

        if(description){
            product.description = description;
        }

        if(color){
            product.color = color;
        }

        if(size){
            product.size = size;
        }

        if(discount){
            product.discount = discount;
        }

        if(stock){
            product.stock = stock;
        }

       await product.save();

        return res.status(201).json({
            message: "product updated successfully",
            product
        })
        
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}


export const deleteProduct = async(req, res) => {
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({
            status: 'error',
            message: 'id is required'
        });
        
        const userId = req.user.id;

        if(!userId) return res.status(400).json({
            status: 'error',
            message: 'unauthorized'
        });

        const product = await Product.findById(id);

        if(!product) return res.status(404).json({
            status: 'error',
            message: 'product not found'
        });
        
//userId and product id match bhayeo bhane matrai delete garna mixha
        if(userId !== product.user.toString()){
            return res.status(401).json({
                status: 'error',
                message: 'you are not owner of the product'
            })
        }

        await product.delete();
        return res.status(200).json({
            message: "product deleted successfully"
        })

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}

export const getProducts = async(req, res) => {
    try {
        // searching, sorting, maxprice,sortBy
        const {search,sortBy,category,maxPrice,minPrice,page=1, limit=10} = req.query;
        const filter = {};

        if(search) filter.name = {$regex: search, $options: 'i'};

        if(category) filter.category = category;

        if(minPrice) filter.prices = {$gte: minPrice};

        if(maxPrice) filter.prices = {$lte: maxPrice};

        if(sortBy) filter.sortBy = sortBy;

        const products = await Product.find(filter).populate({
            path: "user",
            path: "category",
            path: "ratingAndReview",
            path: "stock",
            path: "discount",
            path: "color",
            path: "size"
        }).sort(filter.sortBy).skip((page-1) * limit). limit(limit);

        return res.status(200).json({
            message: "products fetched successfully",
            products
        })

    } catch (err) {

        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}


export const getProductById = async(req, res) => {
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({
            status: 'error',
            message: 'id is required'
        })

        const product = await Product.findById(id).populate({
            path: "user",
            path: "category",
            path: "ratingAndReview",
            path: "stock",
            path: "discount",
            path: "color",
            path: "size"

        });

        if(!product) return res.status(404).json({
            status: 'error',
            message: 'product not found'
        })

        return res.status(200).json({
            message: "product fetched successfully",
            product
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
        
    }
}