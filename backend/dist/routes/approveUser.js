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
// POST /api/approveUser
router.post('/approveUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const user = yield User_1.default.findById(userId);
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
        yield user.save();
        // Recalculate positions for remaining waitlist users
        const users = yield User_1.default.find({ position: { $ne: null } }).sort('position');
        for (const [index, user] of users.entries()) {
            user.position = index + 1;
            yield user.save();
        }
        res.status(200).json({ message: 'User approved and positions updated' });
    }
    catch (err) {
        console.error('Error approving user:', err);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
