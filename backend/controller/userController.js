/**
 * @workspace Jwells/backend
 * @controller UserController
 * @description Handles user authentication and management
 */
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModal from '../model/userModal.js'
import { createToken, setAuthCookie } from '../middleware/authMiddleware.js'


export default class UserController {

    /**
     * @controller registerUser
     * @description Register new user
     */
    static registerUser = async (req, res) => {
        try {
            const { name, email, password , role } = req.body
            const exists = await userModal.findOne({ email })

            if (exists) {
                return res.status(409).json({ success: false, message: "User already exists" })
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({ success: false, message: "Enter valid email address" })
            }

            if (password.length < 6) {
                return res.status(400).json({ success: false, message: "Password must be minimum 6 characters" })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = new userModal({
                name: name,
                email: email,
                password: hashedPassword,
                role: role  // Set default role
            })

            const user = await newUser.save()
            const token = createToken(user.id)
            setAuthCookie(res, token)
            return res.status(201).json({
                success: true,
                message: "Registration successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: "Server error" })
        }
    }

    /**
     * @controller loginUser
     * @description Authenticate user login
     */
    static loginUser = async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await userModal.findOne({ email })
            if (!user) {
                return res.status(404).json({ success: false, message: "User doesn't exist" })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid credentials" })
            }

            const token = createToken(user.id)
            setAuthCookie(res, token)
            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Server error" })
        }
    }

    /**
     * @controller logoutUser
     * @description Clear user authentication
     */
    static logoutUser = async (req, res) => {
        try {
            res.cookie('jwt', '', {
                httpOnly: true,
                expires: new Date(0), // Set expiration to past date
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Server error" });
        }
    }

    /**
     * @controller getUser
     * @description Get user details by userId
     */
    static getUser = async (req, res) => {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required" });
            }

            const user = await userModal.findById(userId).select('-password');

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            return res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Server error" });
        }
    }

    /**
     * @controller updateUser
     * @description Update user details by userId with password verification
     */
    static updateUser = async (req, res) => {
        try {
            const { userId, currentPassword, newPassword } = req.body;

            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required" });
            }

            const user = await userModal.findById(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Password update logic
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ success: false, message: "Both current and new password are required" });
            }

            const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ success: false, message: "Current password does not match" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ success: false, message: "New password must be minimum 6 characters" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password updated successfully"
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
}