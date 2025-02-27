import express from 'express'
import ProductController from '../controller/productController.js'

const router = express.Router()

router.get("/discount", ProductController.getDiscountedProducts)
router.get("/category", ProductController.getCategories)
router.get("/info/:id", ProductController.productInfo)
router.get("/:category", ProductController.getProductsOnCategory)

export default router

