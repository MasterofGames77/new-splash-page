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
// POST /api/waitlist
router.post('/waitlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email is already on the waitlist' });
            return;
        }
        const position = (yield User_1.default.countDocuments()) + 1;
        const newUser = new User_1.default({
            email,
            position,
            isApproved: false,
        });
        yield newUser.save();
        res.status(201).json({
            message: 'Congratulations! You\'ve been added to the waitlist.',
            position,
        });
    }
    catch (err) {
        console.error('Error adding email to waitlist:', err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}));
exports.default = router;
