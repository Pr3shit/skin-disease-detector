
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import predictRouter from "./routes/predict.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/predict", predictRouter);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
