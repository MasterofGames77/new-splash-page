"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const grantProAccessToApprovedUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        // Update approved users without Pro Access, regardless of position
        const updatedUsers = await User_1.default.updateMany({ isApproved: true, hasProAccess: false }, { $set: { hasProAccess: true } });
        console.log(`Updated ${updatedUsers.modifiedCount} users with Pro Access.`);
    }
    catch (error) {
        console.error('Error updating users:', error);
    }
    finally {
        // Disconnect from MongoDB
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
};
grantProAccessToApprovedUsers();
