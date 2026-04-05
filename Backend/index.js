const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./config/db");

const userRoutes = require("./routes/userRoutes");
const photoMugRoutes = require("./routes/photoMugRoutes");
const cushionRoutes = require("./routes/cushionRoutes");
const hamperRoutes = require("./routes/hamperRoutes");
const engravedRoutes = require("./routes/engravedItems");
const orderRoutes = require("./routes/orderRoutes");
const giftRoutes = require("./routes/giftRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://gift-studio-gumt.vercel.app",
    "https://gift-studio-gumt-2bcdjo3nw-tar-i-shis-projects.vercel.app",
    "https://gift-studio-1.vercel.app"
];

// ✅ CORS (SAFE VERSION)
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowed =
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost");

        if (allowed) {
            callback(null, true);
        } else {
            console.log("Blocked:", origin);
            callback(null, false);
        }
    },
    credentials: true
}));

// ❗ IMPORTANT: remove problematic wildcard options
// app.options("*", cors()); ❌ REMOVE THIS

app.use(express.json());

// ✅ Health route
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

// ✅ Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes (order matters)
app.use("/api/auth", userRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/orders", orderRoutes);

// group generic /api routes AFTER specific ones
app.use("/api", cushionRoutes);
app.use("/api", photoMugRoutes);
app.use("/api", hamperRoutes);
app.use("/api", engravedRoutes);
app.use("/api", searchRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
    console.error("ERROR:", err.stack);
    res.status(500).json({ error: "Something went wrong" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});