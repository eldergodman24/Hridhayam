import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        isPreOrder: {
            type: Boolean,
            default: false
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    balanceAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        default: null
    },
    trackingNumber: {
        type: String,
        default: null
    },
    contactPhone: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Order', orderSchema);
