const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    thumbnail: String,
    parent_category :{
        type:mongoose.Schema.Types.ObjectId, // specifying the forein key, from the primary key(ObjectId) of the table 'parent category'
        ref: 'parent_category'
    },
    slug:{ type: String, required: true, unique: true }, 
    description: String,
    is_featured: { type: Boolean, default: false, set: value => value === '' ? false : value },
    status: { type: Boolean, default: true, set: value => value === '' ? true : value },
    created_at: Date,
    update_at: Date,
    deleted_at: { type: Date, default: null }
});


productCategorySchema.pre('save', function () {
    this.created_at = new Date();
})

productCategorySchema.pre('inserOne', function () {
    this.created_at = new Date();
})

productCategorySchema.pre('updateOne', function () {
    this.update_at = new Date();
})

productCategorySchema.pre('findByIdAndUpdate', function () {
    this.created_at = new Date();
})

const productCategoryModel = mongoose.model('product_category', productCategorySchema);

module.exports = productCategoryModel;