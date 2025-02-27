import express from 'express'
import AdminController from '../controller/adminController.js'
import upload from '../middleware/multer.js'

const router = express.Router()

// Product routes
router.post("/product/add", upload.fields([{ name: 'image', maxCount: 1 }]), AdminController.addProduct)
router.delete("/product/remove", AdminController.removeProduct)
router.post("/product", AdminController.listAllProducts)
router.put("/product/update", upload.fields([{ name: 'image', maxCount: 1 }]), AdminController.updateProduct)
router.get("/orders", AdminController.getAllOrders)
router.put("/order/status/:orderId", AdminController.updateOrderDetails)

export default router
