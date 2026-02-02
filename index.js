
import express from 'express';
import mongoose from 'mongoose';
// import authRoute from "./routes/authRoute.js";
// import adminRoute from "./routes/adminRoute.js";
// import cartRoute from "./routes/cartRoute.js";
// import categoryRoute from "./routes/categoryRoute.js";
// import orderRoute from "./routes/orderRoute.js";
// import productRoute from "./routes/productRoute.js";
// import ratingAndReviewRoute from "./routes/ratingAndReviewRoute.js"
const app = express();
const port = 5000;
app.use(express.json());
mongoose.connect('mongodb+srv://Anuj:Anuj2005@anujapi.pcejgp8.mongodb.net/furniture')
.then((val) =>{
app.listen(port, () => {
    console.log('database connected ad server is running');
})
}).catch((err)=>{
    console.log(err);
})

// app.use(authRoute)
// app.use(adminRoute)
// app.use(cartRoute)
// app.use(categoryRoute)
// app.use(orderRoute)
// app.use(productRoute)
// app.use(ratingAndReviewRoute)

