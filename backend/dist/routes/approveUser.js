"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// POST /api/approveUser
router.post('/approveUser', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Approve the user
        user.position = null;
        user.isApproved = true;
        // Check Pro Access eligibility based on the signup date
        const currentDate = new Date();
        const cutoffDate = new Date('2024-12-31T23:59:59');
        if (user.createdAt && user.createdAt <= cutoffDate) {
            user.hasProAccess = true;
        }
        await user.save();
        // Recalculate positions for remaining waitlist users
        const users = await User_1.default.find({ position: { $ne: null } }).sort('position');
        for (const [index, user] of users.entries()) {
            user.position = index + 1;
            await user.save();
        }
        res.status(200).json({ message: 'User approved and positions updated' });
    }
    catch (err) {
        console.error('Error approving user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
