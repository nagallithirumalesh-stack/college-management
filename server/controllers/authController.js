const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'supersecretkey123456789';
    if (!secret) {
        console.error('CRITICAL: JWT_SECRET is not defined! Falling back to builtin secret.');
    }
    try {
        return jwt.sign({ id }, secret, { expiresIn: '30d' });
    } catch (err) {
        console.error('JWT sign error:', err);
        // Re-throw so callers receive 500 and we have logged details
        throw err;
    }
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role, department, semester, username } = req.body;
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        if (username) {
            const usernameExists = await User.findOne({ where: { username } });
            if (usernameExists) return res.status(400).json({ message: 'Username already taken' });
        }

        const user = await User.create({ name, email, password, role, department, semester, username });

        if (user) {
            res.status(201).json({
                _id: user.id, // Sequelize uses id by default, but keeping _id for frontend compatibility if needed, though usually id is number now.
                // Let's stick effectively to `id` but if frontend uses `_id` we might need to be careful.
                // For now, mapping id to _id in response.
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }
    try {
        console.log(`Attempting login for: ${email}`);

        // Allow login with either email or username
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: email }, { username: email }]
            }
        });

        if (!user) {
            console.log("User not found.");
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log("User found. Checking password...");
        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            console.log("Password matched. Generating token...");
            res.json({
                _id: user.id,
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            console.log("Password Mismatch.");
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update profile photo
// @route   POST /api/auth/profile/photo
// @access  Private
exports.updateProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Store relative path
        const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        user.profilePhoto = photoUrl;
        await user.save();

        res.json({
            message: 'Profile photo updated',
            photoUrl: photoUrl
        });
    } catch (error) {
        console.error('Profile upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
};
