const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();   // ✅ FIRST
const axios = require("axios");
require("./config/db");

const userRoutes = require("./routes/userRoutes");
const photoMugRoutes = require('./routes/photoMugRoutes');
const cushionRoutes = require("./routes/cushionRoutes");
const hamperRoutes = require("./routes/hamperRoutes");
const engravedRoutes = require("./routes/engravedItems");
const orderRoutes = require('./routes/orderRoutes');
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require("./routes/searchRoutes");

const app = express();

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "https://gift-studio-gumt.vercel.app",
    "https://gift-studio-gumt-2bcdjo3nw-tar-i-shis-projects.vercel.app",
    "https://gift-studio-1.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // ✅ return origin
        } else {
            console.log("Blocked origin:", origin);
            callback(null, false); // ✅ don't throw error
        }
    },
    credentials: true
}));

// ✅ Handle preflight
app.options("*", cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

app.use("/api/gifts", giftRoutes);
app.use("/api/auth", userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', cushionRoutes);
app.use('/api', photoMugRoutes);
app.use("/api", hamperRoutes);
app.use("/api", engravedRoutes);
app.use('/api/orders', orderRoutes);



app.use("/api", searchRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));