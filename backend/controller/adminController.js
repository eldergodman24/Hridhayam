/**
 * @workspace Jwells/backend
 * @controller AdminController
 * @description Handles admin-specific operations
 */
import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose';
import productModal from '../model/productModal.js'
import Order from '../model/order.js'
import Product from '../model/productModal.js'  // Add this import to ensure Product model is registered

export default class AdminController {
    static addProduct = async (req, res) => {
        try {
            const {
                name,
                price,
                description,
                category,
                discountPercentage,
                quantity
            } = req.body;

            console.log('Received quantity:', quantity); // Debug log

            const image = req.files.image && req.files.image[0];
            const image2 = req.files.image2 && req.files.image2[0];
            const image3 = req.files.image3 && req.files.image3[0];
            const image4 = req.files.image4 && req.files.image4[0];

            if (!image) {
                return res.status(400).json({
                    success: false,
                    message: "Image is required"
                });
            }

            // Validate and parse quantity
            const parsedQuantity = parseInt(quantity);
            if (isNaN(parsedQuantity) || parsedQuantity < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Valid quantity is required"
                });
            }

            // Convert buffer to base64 for Cloudinary
            const b64 = Buffer.from(image.buffer).toString('base64');
            const dataURI = `data:${image.mimetype};base64,${b64}`;
            const image1Upload = await cloudinary.uploader.upload(dataURI, {
                resource_type: 'image',
                folder: 'products'
            });
            const b642 = Buffer.from(image2.buffer).toString('base64');
            const dataURI2 = `data:${image2.mimetype};base64,${b642}`;
            const image2Upload = await cloudinary.uploader.upload(dataURI2, {
                resource_type: 'image',
                folder: 'products'
            });
            const b643 = Buffer.from(image3.buffer).toString('base64');
            const dataURI3 = `data:${image3.mimetype};base64,${b643}`;
            const image3Upload = await cloudinary.uploader.upload(dataURI3, {
                resource_type: 'image',
                folder: 'products'
            });
            const b644 = Buffer.from(image4.buffer).toString('base64');
            const dataURI4 = `data:${image4.mimetype};base64,${b644}`;
            const image4Upload = await cloudinary.uploader.upload(dataURI4, {
                resource_type: 'image',
                folder: 'products'
            });
            // Upload image2, image3, image4 if present
            let image2Url = undefined, image3Url = undefined, image4Url = undefined;
            if (image2) {
                const b64_2 = Buffer.from(image2.buffer).toString('base64');
                const dataURI2 = `data:${image2.mimetype};base64,${b64_2}`;
                image2Url = (await cloudinary.uploader.upload(dataURI2, { resource_type: 'image', folder: 'products' })).secure_url;
            }
            if (image3) {
                const b64_3 = Buffer.from(image3.buffer).toString('base64');
                const dataURI3 = `data:${image3.mimetype};base64,${b64_3}`;
                image3Url = (await cloudinary.uploader.upload(dataURI3, { resource_type: 'image', folder: 'products' })).secure_url;
            }
            if (image4) {
                const b64_4 = Buffer.from(image4.buffer).toString('base64');
                const dataURI4 = `data:${image4.mimetype};base64,${b64_4}`;
                image4Url = (await cloudinary.uploader.upload(dataURI4, { resource_type: 'image', folder: 'products' })).secure_url;
            }

            const product = new productModal({
                name,
                price,
                description,
                image: image1Upload.secure_url,
                image2: image2Upload.secure_url,
                image3: image3Upload.secure_url,
                image4: image4Upload.secure_url,
                category,
                discountPercentage: Number(discountPercentage) || 0,
                inStock: parsedQuantity > 0,
                quantity: parsedQuantity
            });

            await product.save();
            return res.status(201).json({
                success: true,
                message: "Product added successfully",
                data: product
            });
        } catch (err) {
            console.error('Error in addProduct:', err);
            return res.status(500).json({
                success: false,
                message: "Error adding product",
                error: err.message
            });
        }
    }

    static removeProduct = async (req, res) => {
        try {
            const { id } = req.body;
            console.log('Delete request body:', req.body); // Add debug log

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Product ID is required"
                });
            }

            const product = await productModal.findById(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            await product.deleteOne(); // Using deleteOne() instead of remove()
            return res.status(200).json({
                success: true,
                message: "Product removed successfully"
            });
        } catch (err) {
            console.error('Error in removeProduct:', err);
            return res.status(500).json({
                success: false,
                message: "Error removing product"
            });
        }
    }

    static listAllProducts = async (req, res) => {
        try {
            const products = await productModal.find()
            res.json({ success: true, data: products })
        } catch (err) {
            console.error(err)
            res.sendStatus(500)
        }
    }

    static updateProduct = async (req, res) => {
        try {
            const {
                id,
                name,
                price,
                description,
                category,
                discountPercentage,
                inStock,
                quantity
            } = req.body;

            console.log('Update request body:', req.body); // Debug log

            const updateData = {
                name,
                price,
                description,
                category,
                discountPercentage: Number(discountPercentage) || 0,
                inStock: inStock === 'true',
                quantity: Number(quantity) || 0
            };

            // Handle image updates
            if (req.files) {
                // Main image
                if (req.files.image && req.files.image[0]) {
                    const image = req.files.image[0];
                    const b64 = Buffer.from(image.buffer).toString('base64');
                    const dataURI = `data:${image.mimetype};base64,${b64}`;
                    const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
                        resource_type: 'image',
                        folder: 'products'
                    });
                    updateData.image = cloudinaryResponse.secure_url;
                }
                // image2
                if (req.files.image2 && req.files.image2[0]) {
                    const image2 = req.files.image2[0];
                    const b64_2 = Buffer.from(image2.buffer).toString('base64');
                    const dataURI2 = `data:${image2.mimetype};base64,${b64_2}`;
                    const cloudinaryResponse2 = await cloudinary.uploader.upload(dataURI2, {
                        resource_type: 'image',
                        folder: 'products'
                    });
                    updateData.image2 = cloudinaryResponse2.secure_url;
                }
                // image3
                if (req.files.image3 && req.files.image3[0]) {
                    const image3 = req.files.image3[0];
                    const b64_3 = Buffer.from(image3.buffer).toString('base64');
                    const dataURI3 = `data:${image3.mimetype};base64,${b64_3}`;
                    const cloudinaryResponse3 = await cloudinary.uploader.upload(dataURI3, {
                        resource_type: 'image',
                        folder: 'products'
                    });
                    updateData.image3 = cloudinaryResponse3.secure_url;
                }
                // image4
                if (req.files.image4 && req.files.image4[0]) {
                    const image4 = req.files.image4[0];
                    const b64_4 = Buffer.from(image4.buffer).toString('base64');
                    const dataURI4 = `data:${image4.mimetype};base64,${b64_4}`;
                    const cloudinaryResponse4 = await cloudinary.uploader.upload(dataURI4, {
                        resource_type: 'image',
                        folder: 'products'
                    });
                    updateData.image4 = cloudinaryResponse4.secure_url;
                }
            }

            const updatedProduct = await productModal.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: updatedProduct
            });
        } catch (err) {
            console.error('Error in updateProduct:', err);
            return res.status(500).json({
                success: false,
                message: "Error updating product",
                error: err.message
            });
        }
    }

    static async getAllOrders(req, res) {
        try {
            const orders = await Order.find()
                .populate('userId', 'email')
                .sort({ createdAt: -1 });

            const ordersWithPaymentStatus = orders.map(order => ({
                ...order.toObject(),
                paymentStatus: order.paymentMethod === 'cod' ?
                    'Cash on Delivery' :
                    (order.balanceAmount === 0 ? 'Paid' : 'Partially Paid')
            }));

            return res.status(200).json({
                success: true,
                data: ordersWithPaymentStatus
            });
        } catch (error) {
            console.error('Error in getAllOrders:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching orders',
                error: error.message
            });
        }
    }

    static updateOrderDetails = async (req, res) => {
        try {
            const { orderId } = req.params;
            const { status, trackingNumber } = req.body;

            const updateData = {};

            // Handle status update if provided
            if (status !== undefined) {
                const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid status'
                    });
                }
                updateData.status = status;
            }

            // Handle tracking number update if provided
            if (trackingNumber !== undefined) {
                updateData.trackingNumber = trackingNumber;
            }

            // If neither status nor tracking number provided
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No valid update data provided'
                });
            }

            const order = await Order.findByIdAndUpdate(
                orderId,
                updateData,
                { new: true })
                .populate('userId', 'name email')// populate user details
                .populate('items.productId');


            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Order details updated successfully',
                data: order
            });
        } catch (error) {
            console.error('Error in updateOrderDetails:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating order details',
                error: error.message
            });
        }
    }
}