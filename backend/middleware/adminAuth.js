import userModel from '../model/userModel.js';

const checkAdminRole = async (req, res, next) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await userModel.findById(userId);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Admin access required"
            });
        }

        next();
    } catch (error) {
        console.error('Admin authentication error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default checkAdminRole;
