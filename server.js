import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import questionRoutes from "./routes/questionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RAG Backend Running Successfully",
  });
});

// Routes
app.use("/api/files", uploadRoutes);
app.use("/api/questions", questionRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});