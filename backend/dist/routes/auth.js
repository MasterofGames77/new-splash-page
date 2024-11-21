"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
const BASE_URL = 'http://localhost:3000';
// Helper function to get the correct ordinal suffix for a position
function getOrdinalSuffix(position) {
    const remainder10 = position % 10;
    const remainder100 = position % 100;
    if (remainder10 === 1 && remainder100 !== 11)
        return `${position}st`;
    if (remainder10 === 2 && remainder100 !== 12)
        return `${position}nd`;
    if (remainder10 === 3 && remainder100 !== 13)
        return `${position}rd`;
    return `${position}th`;
}
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email is required.' });
        return;
    }
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            if (existingUser.isApproved) {
                // User already approved, return assistant link
                res.status(200).json({
                    message: 'You have already signed up and are approved.',
                    link: `${BASE_URL}/assistant`,
                });
                return;
            }
            // User is already on the waitlist
            res.status(200).json({
                message: `You have already signed up and are on the waitlist. Your current waitlist position is ${existingUser.position}.`,
                position: existingUser.position,
            });
            return;
        }
        // Assign a new position on the waitlist
        const position = (await User_1.default.countDocuments()) + 1;
        // Determine Pro Access eligibility
        const currentDate = new Date();
        const cutoffDate = new Date('2024-12-31T23:59:59');
        const hasProAccess = currentDate <= cutoffDate;
        const newUser = new User_1.default({
            email,
            position,
            isApproved: false,
            hasProAccess,
        });
        await newUser.save();
        const bonusMessage = hasProAccess
            ? `You are the ${getOrdinalSuffix(position)} of the first 5,000 users to sign up! You will receive 1 year of Wingman Pro for free!`
            : '';
        res.status(201).json({
            message: `Congratulations! You've been added to the waitlist. ${bonusMessage}`,
            position,
        });
    }
    catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error adding email to the waitlist.' });
    }
});
exports.default = router;