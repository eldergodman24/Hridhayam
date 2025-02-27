import jwt from 'jsonwebtoken'

/**
 * @workspace Jwells/backend
 * @middleware authToken
 * @description Authenticates JWT token and sets userId in request
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;
        console.log(token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                redirect: '/login'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token",
                    redirect: '/login'
                });
            }

            req.userId = decoded.userId;
            next();
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            redirect: '/login'
        });
    }
}

export default authToken;