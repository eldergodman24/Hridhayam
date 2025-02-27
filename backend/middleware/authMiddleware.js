/**
 * @workspace Jwells/backend
 */
import jwt from 'jsonwebtoken'

export const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

export const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true ,
secure: true,
sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    });
}

export const clearAuth = (req, res) => {
    try {
        res.clearCookie('token');
        req.session.destroy((err) => {
            if (err) {
                return res.sendStatus(500).json({
                    success: false,
                    message: "Error clearing session"
                });
            }
            return res.sendStatus(200).json({
                success: true,
                message: "Logged out successfully"
            });
        });
    } catch (error) {
        return res.sendStatus(500).json({
            success: false,
            message: "Server error"
        });
    }
}
