const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");
const bookingRoutes = require("./routes/booking");

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// ✅ DATABASE
mongoose.connect("mongodb://127.0.0.1:27017/eventDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ SERVER START
app.listen(5000, () => {
  console.log("Server running on port 5000");
});