import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    discountPercentage: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
})

const productModal = mongoose.models.product || mongoose.model("product", productSchema)

export default productModal