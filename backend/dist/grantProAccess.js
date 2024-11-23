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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const grantProAccessToApprovedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        // Update approved users without Pro Access, regardless of position
        const updatedUsers = yield User_1.default.updateMany({ isApproved: true, hasProAccess: false }, { $set: { hasProAccess: true } });
        console.log(`Updated ${updatedUsers.modifiedCount} users with Pro Access.`);
    }
    catch (error) {
        console.error('Error updating users:', error);
    }
    finally {
        // Disconnect from MongoDB
        yield mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
});
grantProAccessToApprovedUsers();
