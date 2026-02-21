import Product from "../models/product.js";
import fs from "fs";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 8, search, category, minPrice, maxPrice, sort = "newest" } = req.query;
    const query = {};

    // 🔎 Search
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;

    // 💰 Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 🔽 Sorting
    let sortOption = {};
    if (sort === "price-asc") sortOption.price = 1;
    else if (sort === "price-desc") sortOption.price = -1;
    else if (sort === "top-rated") sortOption.averageRating = -1; // ⭐ Sort by rating
    else sortOption.createdAt = -1;

    const skip = (page - 1) * limit;

    const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);

    res.status(200).json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.id);
    if (!product) return res.status(404).json({ status: "error", message: "Product not found" });

    res.status(200).json({ status: "success", product });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// CREATE product
export const createProduct = async (req, res) => {
  const { title, description, price, category, colors, sizes, stock, sku, tags } = req.body;

  try {
    const product = await Product.create({
      title,
      description,
      price,
      category,
      stock,
      sku,
      tags: tags ? JSON.parse(tags) : [],
      colors: colors ? JSON.parse(colors) : [],
      sizes: sizes ? JSON.parse(sizes) : [],
      image: req.imagePaths || [],
    });

    res.status(201).json({ status: "success", data: "Product created successfully", product });
  } catch (err) {
    if (req.imagePaths) req.imagePaths.forEach((file) => fs.unlinkSync(`./uploads/${file}`));
    res.status(400).json({ status: "error", message: err.message });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  const { title, description, price, category, colors, sizes, stock, sku, tags } = req.body;

  try {
    const product = await Product.findById(req.id);
    if (!product) {
      if (req.imagePaths) req.imagePaths.forEach((file) => fs.unlinkSync(`./uploads/${file}`));
      return res.status(404).json({ status: "error", data: "Product not found" });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.colors = colors ? JSON.parse(colors) : product.colors;
    product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
    product.sku = sku || product.sku;
    product.tags = tags ? JSON.parse(tags) : product.tags;

    // Replace images if new ones uploaded
    if (req.imagePaths?.length) {
      // remove old images
      product.image.forEach((file) => fs.unlinkSync(`./uploads/${file}`));
      product.image = req.imagePaths;
    }

    await product.save();
    res.status(200).json({ status: "success", data: "Product updated successfully", product });
  } catch (err) {
    if (req.imagePaths) req.imagePaths.forEach((file) => fs.unlinkSync(`./uploads/${file}`));
    res.status(500).json({ status: "error", message: err.message });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.id);
    if (!product) return res.status(404).json({ status: "error", message: "Product not found" });

    if (product.image?.length) {
      product.image.forEach((img) => {
        if (fs.existsSync(`./uploads/${img}`)) fs.unlinkSync(`./uploads/${img}`);
      });
    }

    await product.deleteOne();
    res.status(200).json({ status: "success", message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// GET related products
export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const currentProduct = await Product.findById(id);
    if (!currentProduct) return res.status(404).json({ message: "Product not found" });

    const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: id },
    }).limit(4);

    res.status(200).json({ status: "success", products: relatedProducts });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};


// import Product from "../models/product.js";
// import fs from "fs";


// // GET all products
// export const getProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 8,
//       search,
//       category,
//       minPrice,
//       maxPrice,
//       sort = "newest",
//     } = req.query;

//     const query = {};

//     // 🔎 Search
//     if (search) {
//       query.title = { $regex: search, $options: "i" };
//     }

//     // 📂 Category
//     if (category) {
//       query.category = category;
//     }

//     // 💰 Price Range
//     if (minPrice || maxPrice) {
//       query.price = {};
//       if (minPrice) query.price.$gte = Number(minPrice);
//       if (maxPrice) query.price.$lte = Number(maxPrice);
//     }

//     // 🔽 Sorting
//     let sortOption = {};
//     if (sort === "price-asc") sortOption.price = 1;
//     else if (sort === "price-desc") sortOption.price = -1;
//     else sortOption.createdAt = -1;

//     const skip = (page - 1) * limit;

//     const products = await Product.find(query)
//       .sort(sortOption)
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Product.countDocuments(query);

//     res.status(200).json({
//       products,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




// // GET single product by ID
// export const getProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.id);
//     if (!product)
//       return res.status(404).json({ status: "error", message: "Product not found" });

//     return res.status(200).json({ status: "success", product });
//   } catch (err) {
//     return res.status(500).json({ status: "error", message: err.message });
//   }
// };


// /// Create Product
// export const createProduct = async (req, res) => {
//     const { title, description, price, category, colors, sizes, stock, sku,tags } = req.body;

//     try {
//         const product = await Product.create({
//             title,
//             description,
//             price,
//             category,
//             stock,
//             sku,
//             tags: tags ? JSON.parse(tags) : [], // tags array
//             colors: JSON.parse(colors), // colors array
//             sizes: JSON.parse(sizes),   // sizes array
//             image: req.imagePaths,      // multiple images
//         });

//         return res.status(201).json({ status: 'success', data: 'Product created successfully', product });
//     } catch (err) {
//         // Remove uploaded files if creation fails
//         if (req.imagePaths) {
//             req.imagePaths.forEach(file => fs.unlinkSync(`./uploads/${file}`));
//         }
//         return res.status(400).json({ status: 'error', message: err.message });
//     }
// };

// // Update Product
// export const updateProduct = async (req, res) => {
//     const { title, description, price, category, colors, sizes, stock,sku,tags } = req.body;

//     try {
//         const product = await Product.findById(req.id);
//         if (!product) {
//             if (req.imagePaths) req.imagePaths.forEach(file => fs.unlinkSync(`./uploads/${file}`));
//             return res.status(404).json({ status: 'error', data: 'Product not found' });
//         }

//         product.title = title || product.title;
//         product.description = description || product.description;
//         product.price = price || product.price;
//         product.category = category || product.category;
//         product.stock = stock || product.stock;
//         product.colors = colors ? JSON.parse(colors) : product.colors;
//         product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
//         product.sku = sku || product.sku;
//         product.tags = tags ? JSON.parse(tags) : product.tags;


//         // Replace images if new ones uploaded
//         if (req.imagePaths?.length) {
//             // remove old images
//             product.images.forEach(file => fs.unlinkSync(`./uploads/${file}`));
//             product.images = req.imagePaths;
//         }

//         await product.save();
//         return res.status(200).json({ status: 'success', data: 'Product updated successfully', product });

//     } catch (err) {
//         if (req.imagePaths) req.imagePaths.forEach(file => fs.unlinkSync(`./uploads/${file}`));
//         return res.status(500).json({ status: 'error', message: err.message });
//     }
// };

// // DELETE product
// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.id);
//     if (!product) return res.status(404).json({ status: "error", message: "Product not found" });

//     // Delete images
//     if (product.images && product.images.length) {
//       product.images.forEach((img) => {
//         if (fs.existsSync(`./uploads/${img}`)) fs.unlinkSync(`./uploads/${img}`);
//       });
//     }

//     await product.deleteOne();
//     return res.status(200).json({ status: "success", message: "Product deleted successfully" });
//   } catch (err) {
//     return res.status(500).json({ status: "error", message: err.message });
//   }
// };


// export const getRelatedProducts = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Get the current product
//     const currentProduct = await Product.findById(id);
//     if (!currentProduct) return res.status(404).json({ message: "Product not found" });

//     // Get related products (same category, exclude current product)
//     const relatedProducts = await Product.find({
//       category: currentProduct.category,
//       _id: { $ne: id }
//     }).limit(4); // limit to 4 items

//     res.status(200).json({ status: "success", products: relatedProducts });
//   } catch (err) {
//     res.status(500).json({ status: "error", message: err.message });
//   }
// };

