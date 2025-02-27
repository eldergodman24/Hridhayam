import jwt from 'jsonwebtoken';

/**
 * @workspace Jwells/backend
 * @middleware verifyToken
 * @description Verifies JWT token from cookies
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                redirect: '/login'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format",
                redirect: '/login'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            redirect: '/login'
        });
    }
};

export default verifyToken;
