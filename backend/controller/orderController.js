import Razorpay from 'razorpay';
import Order from '../model/order.js';
import CartProduct from '../model/cartProduct.js';
import ContactController from '../controllers/contactController.js';
import crypto from 'crypto';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default class OrderController {
    static async createOrder(req, res) {
        try {
            const {
                userId,
                shippingAddress,
                contactPhone,
                totalAmount,
                balanceDue,
                paidAmount,
                paymentMethod,
                transactionId
            } = req.body;

            if (!userId || !shippingAddress || !contactPhone || !paymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            // Get cart items
            const cartItems = await CartProduct.find({ userId }).populate('productId');

            if (!cartItems.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Cart is empty'
                });
            }

            const orderItems = cartItems.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price,
                isPreOrder: paymentMethod === 'cod' ? false : item.isPreOrder,
                partialPayment: paymentMethod === 'cod' ? 0 : (item.isPreOrder ? item.partialPayment : 0)
            }));


            // Create order with payment method and transactionId
            const order = await Order.create({
                userId,
                items: orderItems,
                totalAmount,
                paidAmount,
                balanceAmount: balanceDue,
                shippingAddress,
                contactPhone,
                paymentMethod,
                paymentStatus: paymentMethod === 'cod' ? 'pending' : 'partial',
                transactionId: transactionId || null
            });

            // Call checkout from ContactController
            await ContactController.checkout({
                body: {
                    userId,
                    phoneNumber: contactPhone,
                    shippingAddress,
                    totalAmount,
                    balanceDue,
                    transactionId
                }
            }, {
                status: () => ({
                    json: (data) => {
                        if (!data.success) {
                            throw new Error(data.message);
                        }
                    }
                })
            });

            // Clear cart only after successful checkout
            await CartProduct.deleteMany({ userId });

            return res.status(201).json({
                success: true,
                message: 'Order created successfully',
                orderId: order.id,
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error creating order',
                error: error.message
            });
        }
    }

    static async handleRazorpayPayment(req, res) {
        try {
            const { payAmount } = req.body;
            const options = {
                amount: payAmount * 100, // Amount in paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                payment_capture: 1,
            };

            razorpayInstance.orders.create(options, (err, order) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err,
                        error: err.message
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: order
                });
            });
        }
        catch (error) {
            console.error('Razorpay payment error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error processing Razorpay payment',
                error: error.message
            });
        }
    }

    static async verifyPayment(req, res) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

            const sign = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest('hex');

            if (razorpay_signature === expectedSign) {
                // Update order with transaction ID


                res.status(200).json({
                    success: true,
                    message: 'Payment verified successfully',
                    transactionId: razorpay_payment_id
                });
            } else {
                res.status(400).json({ success: false, error: 'Invalid payment signature' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static getPaymentStatus(order) {
        if (order.paymentMethod === 'cod') {
            return 'Cash on Delivery';
        }
        return order.balanceAmount === 0 ? 'Paid' : 'Partially Paid';
    }

    static async getUserOrders(req, res) {
        try {
            const { userId } = req.body;

            const orders = await Order.find({ userId: userId })
                .sort({ createdAt: -1 });

            const ordersWithPaymentStatus = orders.map(order => ({
                ...order.toObject(),
                paymentStatus: OrderController.getPaymentStatus(order)
            }));

            return res.status(200).json({
                success: true,
                data: ordersWithPaymentStatus
            });
        } catch (error) {
            console.error('Error in getUserOrders:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching orders',
                error: error.message
            });
        }
    }

    static async getOrderById(req, res) {
        try {
            const { orderId } = req.params;
            const order = await Order.findById(orderId)
                .populate('items.productId')
                .populate('userId', 'email name');  // Added 'name' to population

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            const orderWithPaymentStatus = {
                ...order.toObject(),
                paymentStatus: OrderController.getPaymentStatus(order)
            };

            return res.status(200).json({
                success: true,
                data: orderWithPaymentStatus
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching order',
                error: error.message
            });
        }
    }
}
