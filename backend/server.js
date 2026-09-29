require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (request, response) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  response.status(200).json({
    status: "ok",
    message: "Backend is running",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.use("/api/recipes", recipeRoutes);

app.use((error, request, response, next) => {
  if (error.type === "entity.parse.failed") {
    return response.status(400).json({
      message: "Request body must contain valid JSON.",
    });
  }

  return next(error);
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
  connectDB();
});