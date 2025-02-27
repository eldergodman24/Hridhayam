import express from 'express'
import UserController from '../controller/userController.js'

const router = express.Router()

router.post("/register", UserController.registerUser)
router.post("/login", UserController.loginUser)
router.post("/logout", UserController.logoutUser)
router.post("/", UserController.getUser)
router.put("/update", UserController.updateUser)


export default router