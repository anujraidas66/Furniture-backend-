import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoute from './routes/productRoute.js'
import userRoute from './routes/userRoute.js'
// import contactRoute from './routes/contactRoute.js'
import fileUpload from 'express-fileupload';
const app = express();
const port = 5000;

mongoose.connect('mongodb+srv://Anuj:Anuj2005@anujapi.pcejgp8.mongodb.net/store')
.then((val)=>{
    app.listen(port,()=>{
    console.log('database connected and server is running'); 
  })

   }).catch((err)=>{ 
    console.log(err);
  })

app.use(express.static('uploads'));

app.get('/',(req,res) => {
    res.send('hello world')
})

app.use(cors());

app.use(express.json());

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));
app.use(productRoute); 
app.use(userRoute);
// app.use('/api/contacts', contactRoute);
