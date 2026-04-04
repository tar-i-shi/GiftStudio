const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');

require("./config/db")
const userRoutes = require("./routes/userRoutes");



const photoMugRoutes = require('./routes/photoMugRoutes');
const cushionRoutes = require("./routes/cushionRoutes");
const hamperRoutes = require("./routes/hamperRoutes");
const engravedRoutes = require("./routes/engravedItems");
const orderRoutes = require('./routes/orderRoutes');
const giftRoutes = require('./routes/giftRoutes');

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/gifts", giftRoutes);
app.use("/api/auth", userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', cushionRoutes);
app.use('/api', photoMugRoutes);
app.use("/api/", hamperRoutes);
app.use("/api", engravedRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));