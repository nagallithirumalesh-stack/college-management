const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'supersecretkey123456789';
            const decoded = jwt.verify(token, secret);
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Required roles: ${roles.join(', ')}` });
        }
        next();
    };
};

// Middleware to check if user is HOD of a specific department
const isHODOfDepartment = (req, res, next) => {
    // This will be used when we need to verify HOD department access
    // For now, just pass through - will be implemented when department filtering is needed
    next();
};

// Middleware to check if user belongs to specific department/year/section
const checkDepartmentAccess = (req, res, next) => {
    // This will be used for role-based data filtering
    // For now, just pass through - will be implemented when needed
    next();
};

module.exports = { protect, restrictTo, isHODOfDepartment, checkDepartmentAccess };
