const express = require('express');
const { registerUser, loginUser, getMe, getUsers, deleteUser } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.get('/users', protect, restrictTo('admin'), getUsers);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);

module.exports = router;
