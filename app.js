const express = require("express");
const mongoose = require("mongoose");
const baseRouter = require("./routes/base-router");
const path = require("path");
const baseMiddleware = require("./middlewares/base-middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv/config");

const app = express();
const corsOptions = {
  origin: "https://ticketit.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use("/", baseMiddleware);
app.use("/", baseRouter);
app.get("/", (req, res) => {
  res.send("Hello world");
});

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI required in .env");
}

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to database.");
});

module.exports = app;
