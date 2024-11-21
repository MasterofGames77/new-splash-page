"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
// Import Routes
const auth_1 = __importDefault(require("./routes/auth"));
const getWaitlistPosition_1 = __importDefault(require("./routes/getWaitlistPosition"));
const approveUser_1 = __importDefault(require("./routes/approveUser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// CORS Setup
const corsOptions = {
    origin: (origin, callback) => {
        const whitelist = [
            'http://localhost:3000', // For local development
            'https://unified-vgw-splash-page-ce047efdcf15.herokuapp.com' // Production link
        ];
        if (!origin || whitelist.includes(origin)) {
            console.log(`CORS request from origin: ${origin}`);
            callback(null, true);
        }
        else {
            console.warn(`CORS request blocked from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// MongoDB Connection to Splash Page MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB (Splash Page) connected successfully'))
    .catch((err) => {
    console.error('MongoDB connection error (Splash Page):', err);
    process.exit(1); // Exit if connection fails
});
// Routes Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api', getWaitlistPosition_1.default);
app.use('/api', approveUser_1.default);
// Serve Static Files from the Frontend Build Directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/out')));
// Catch-All Route to Serve the Frontend `index.html`
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../frontend/out/index.html'));
});
// Global Error-Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Global error handler:`, err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
// Start the Server
app.listen(port, () => {
    console.log(`[${new Date().toISOString()}] Server running on port ${port}`);
});
