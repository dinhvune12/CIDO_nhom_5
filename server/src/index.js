import "./config/env.js"; // ✅ load env trước tất cả

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import restaurantsRoutes from "./routes/restaurants.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/restaurants", restaurantsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
