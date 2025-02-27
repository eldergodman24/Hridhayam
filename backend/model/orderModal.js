import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    Items: { type: Array, required: true },
    Amount: { type: number, required: true },
    Address: { type: Object, required: true },
    Status: { type: String, required: true, default: "Order Placed" },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;