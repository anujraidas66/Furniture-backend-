
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },

    admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Admin'
    }
}, {
    timestamps : true
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;