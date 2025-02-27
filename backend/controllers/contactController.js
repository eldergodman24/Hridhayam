import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';
import PDFDocument from 'pdfkit';
import User from '../model/userModal.js';
import Cart from '../model/cartProduct.js';
import axios from 'axios'; // Add this import for fetching images

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID, // Your email
        pass: process.env.PASS_KEY // Your password
    },
    secure: false, // use SSL
    port: 25, // port for secure SMTP
    tls: {
        rejectUnauthorized: false
    }
});

export default class ContactController {
    // Contact form handler
    static sendContactForm = asyncHandler(async (req, res) => {
        const { firstName, lastName, email, description, phone } = req.body;
        const files = req.files;

        if (!firstName || !email || !description) {
            res.status(400);
            throw new Error('Please fill all required fields');
        }

        try {
            // Prepare attachments if files exist
            let attachments = [];
            if (files && files.length > 0) {
                attachments = files.map(file => ({
                    filename: file.originalname,
                    content: file.buffer,
                    contentType: file.mimetype
                }));
            }

            const mailOptions = {
                from: email,
                to: process.env.EMAIL_ID, // Your email where you want to receive descriptions
                subject: `Contact Form Message from ${firstName}`,
                html: `
                    <h3>Contact Form Message</h3>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${description}</p>
                    ${files && files.length > 0 ? `<p><strong>Attachments:</strong> ${files.length} file(s)</p>` : ''}
                `,
                attachments: attachments
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({
                success: true,
                message: 'Contact form submitted successfully with attachments'
            });

        } catch (error) {
            console.error('Email sending error:', error);
            res.status(500).json({
                success: false,
                message: 'Error sending email',
                error: error.message
            });
        }
    });

    static checkout = asyncHandler(async (req, res) => {
        const { userId, phoneNumber, shippingAddress, totalAmount, balanceDue, transactionId } = req.body;

        try {
            console.log(process.env.EMAIL_ID);
            console.log(process.env.PASS_KEY);
            const user = await User.findById(userId);
            const cartItems = await Cart.find({ userId })
                .populate('productId');

            if (!user || !cartItems.length) {
                return res.status(400).json({
                    success: false,
                    message: 'No cart items found'
                });
            }

            // Create PDF with updated styling
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));

            // Add company header
            doc.font('Helvetica-Bold')
                .fontSize(28)
                .fillColor('#333333')
                .text('J WELLS', { align: 'center' })
                .fontSize(14)
                .fillColor('#666666')
                .text('Order Invoice', { align: 'center' })
                .moveDown(2);

            // Add order information
            doc.font('Helvetica-Bold')
                .fontSize(12)
                .text('ORDER DETAILS', { underline: true })
                .moveDown(0.5)
                .font('Helvetica')
                .text(`Order Date: ${new Date().toLocaleDateString()}`)
                .text(`Customer Email: ${user.email}`)
                .text(`Phone Number: ${phoneNumber}`)
                .moveDown(0.5)
                .font('Helvetica-Bold')
                .text('Shipping Address:', { underline: true })
                .font('Helvetica')
                .text(shippingAddress)
                .moveDown(2);

            // Add product table header
            doc.font('Helvetica-Bold')
                .fillColor('#000000')
                .text('PRODUCT DETAILS', { underline: true })
                .moveDown();

            let total = totalAmount;  // Use the passed totalAmount instead of calculating
            let yPosition = doc.y;

            // Process each product with improved layout
            for (const item of cartItems) {
                const subtotal = item.productId.price * item.quantity;
                total += subtotal;

                if (yPosition > 650) {
                    doc.addPage();
                    yPosition = 50;
                }

                // Product container
                doc.rect(50, doc.y, 500, 200)
                    .stroke()
                    .moveDown(0.5);

                // Product title with background
                doc.fillColor('#f0f0f0')
                    .rect(55, doc.y, 490, 25)
                    .fill()
                    .fillColor('#000000')
                    .font('Helvetica-Bold')
                    .fontSize(14)
                    .text(item.productId.name, 60, doc.y + 5)
                    .moveDown();

                // Two-column layout for image and details
                const imageX = 60;
                const detailsX = 280;
                const startY = doc.y;

                // Add image if available
                if (item.productId.image && item.productId.image.length > 0) {
                    try {
                        const response = await axios.get(item.productId.image[0], {
                            responseType: 'arraybuffer'
                        });
                        const imageBuffer = Buffer.from(response.data);

                        doc.image(imageBuffer, imageX, startY, {
                            fit: [180, 150],
                            align: 'left'
                        });
                    } catch (error) {
                        doc.text('Image not available', imageX, startY);
                    }
                }

                // Add product details
                doc.font('Helvetica')
                    .fontSize(12)
                    .text('Product Details:', detailsX, startY)
                    .moveDown(0.5)
                    .text(`Price: Rs. ${Number(item.productId.price).toString()}`, detailsX)
                    .text(`Quantity: ${item.quantity}`, detailsX)
                    .font('Helvetica-Bold')
                    .text(`Subtotal: Rs. ${Number(subtotal).toString()}`, detailsX)
                    .moveDown(2);

                yPosition = doc.y;
            }

            // Add total section with styling
            doc.rect(50, doc.y, 500, 80)  // Increased height for payment details
                .fillColor('#333333')
                .fill()
                .fillColor('#FFFFFF')
                .font('Helvetica-Bold')
                .fontSize(16)
                .text(`Total Amount: Rs. ${Number(totalAmount).toString()}`, 60, doc.y + 15)
                .fontSize(14)
                .text(`Paid Amount: Rs. ${Number(totalAmount - balanceDue).toString()}`, 60)
                .text(`Balance Due: Rs. ${Number(balanceDue).toString()}`, 60);

            // Add footer with more space
            doc.moveDown(4) // Add extra space
                .fillColor('#666666')
                .fontSize(10)
                .text('Thank you for shopping with J WELLS!', {
                    align: 'center',
                    y: doc.page.height - 70 // Increased space from bottom
                });

            doc.end();

            // Convert PDF to buffer
            const pdfBuffer = Buffer.concat(buffers);

            // Send email with PDF
            const mailOptions = {
                from: user.email,
                to: process.env.EMAIL_ID,
                subject: 'Order Confirmation',
                html: `
                    <h3>New Order Received</h3>
                    <p>Customer Email: ${user.email}</p>
                    <p>Phone Number: ${phoneNumber}</p>
                    <p><strong>Shipping Address:</strong><br>${shippingAddress}</p>
                    <p><strong>Payment Details:</strong></p>
                    <p>Total Amount: Rs. ${totalAmount}</p>
                    <p>Paid Amount: Rs. ${totalAmount - balanceDue}</p>
                    <p>Balance Due: Rs. ${balanceDue}</p>
                    ${transactionId ? `<p><strong>Transaction ID:</strong> ${transactionId}</p>` : ''}
                    <p>Please check the attached PDF for complete order details.</p>
                `,
                attachments: [{
                    filename: 'order-details.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }]
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({
                success: true,
                message: 'Order placed successfully'
            });

        } catch (error) {
            console.error('Checkout error:', error);
            res.status(500).json({
                success: false,
                message: 'Error processing order',
                error: error.message
            });
        }
    });
}