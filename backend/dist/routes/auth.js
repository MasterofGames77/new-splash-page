"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
const isProduction = process.env.NODE_ENV === 'production';
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
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Signup request received:', req.body);
    const { email } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            if (existingUser.isApproved) {
                // Respond with the assistant link if the user is approved
                res.status(200).json({
                    message: 'You have already signed up and are approved.',
                    link: `${BASE_URL}/assistant`,
                });
                return;
            }
            // Respond with the waitlist position if the user is on the waitlist but not yet approved
            res.status(200).json({
                message: `You have already signed up and are on the waitlist. Your current waitlist position is ${existingUser.position}.`,
                position: existingUser.position,
            });
            return;
        }
        // Calculate the new user's position in the waitlist
        const position = (yield User_1.default.countDocuments()) + 1;
        const newUser = new User_1.default({ email, position, isApproved: false });
        yield newUser.save();
        // Include a bonus message if the user is within the first 5,000 signups
        const bonusMessage = position <= 5000
            ? `You are the ${getOrdinalSuffix(position)} of the first 5,000 users to sign up! You will receive 1 year of Wingman Pro for free!`
            : '';
        res.status(201).json({
            message: `Congratulations! You've been added to the waitlist. ${bonusMessage}`,
            position,
        });
    }
    catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error adding email to the waitlist' });
    }
}));
exports.default = router;
