import mongoose from "mongoose";

const priceGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    prices: { type: Object, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
    codp: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    description: {type: Array, default: []},
    image: {type: Array, default: []},
    category: {type: String, required: true},
    subcategory: {type: String, required: true},
    priceGroups: { type: [priceGroupSchema], required: true }, // <-- Changed field
    isNewProduct: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
}, {timestamps: true})

const Product = mongoose.model('Product', productSchema);

export default Product;
