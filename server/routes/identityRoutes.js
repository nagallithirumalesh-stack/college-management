const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Helper component to simulate Groq/FaceNet embedding generation
const generateMockEmbedding = () => {
    // Generate random 128-dimensional vector
    return Array.from({ length: 128 }, () => Math.random());
};

const calculateCosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

// @desc    Enroll Face ID (One-time)
// @route   POST /api/identity/enroll
router.post('/enroll', protect, async (req, res) => {
    try {
        // In real app: req.body.image -> Send to Groq/Vision API -> Get Embedding
        // Mock: Generate random embedding
        const mockEmbedding = generateMockEmbedding();

        const user = await User.findById(req.user.id);
        user.faceEmbeddings = mockEmbedding;
        user.isIdentityVerified = true;
        await user.save();

        res.json({ message: 'Face ID Enrolled Successfully', verified: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Verify Identity
// @route   POST /api/identity/verify
router.post('/verify', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.isIdentityVerified || user.faceEmbeddings.length === 0) {
            return res.status(400).json({ message: 'Face ID not enrolled' });
        }

        // In real app: req.body.image -> Send to Groq -> Get Embedding
        // Mock: Generate a 'similar' embedding to simulate match
        // For testing failure, we could pass a flag
        const { simulateFailure } = req.body;

        let liveEmbedding;
        if (simulateFailure) {
            liveEmbedding = generateMockEmbedding(); // Completely random = low similarity
        } else {
            // Create a slightly noisy version of stored embedding (High similarity)
            liveEmbedding = user.faceEmbeddings.map(v => v + (Math.random() * 0.01 - 0.005));
        }

        const similarity = calculateCosineSimilarity(user.faceEmbeddings, liveEmbedding);
        const THRESHOLD = 0.90; // Typical threshold

        if (similarity > THRESHOLD) {
            res.json({ success: true, message: 'Identity Verified', similarity: similarity.toFixed(4) });
        } else {
            res.status(401).json({ success: false, message: 'Verification Failed', similarity: similarity.toFixed(4) });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
