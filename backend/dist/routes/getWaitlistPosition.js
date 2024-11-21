"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// GET /api/waitlist/position?email=user@example.com
router.get('/position', async (req, res) => {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
        res.status(400).json({ message: 'Email query parameter is required and should be a string.' });
        return;
    }
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (user.isApproved) {
            res.status(200).json({
                isApproved: true,
                message: 'You are approved!',
                link: 'https://vgw-splash-page-frontend-71431835113b.herokuapp.com/',
            });
        }
        else {
            res.status(200).json({
                position: user.position,
                isApproved: false,
                message: `You are on the waitlist. Your position is ${user.position}.`,
            });
        }
    }
    catch (error) {
        console.error('Error retrieving waitlist position:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.default = router;
