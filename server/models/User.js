const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'faculty', 'student'], default: 'student' },
    department: { type: String },
    semester: { type: Number },
    // Gamification fields
    points: { type: Number, default: 0 },
    band: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
    badges: [{ type: String }], // Array of obtained badge IDs or names

    // AI Identity
    faceEmbeddings: { type: [Number], default: [] }, // Store 128/512/1024-d vector
    isIdentityVerified: { type: Boolean, default: false }
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
