import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cohereRoutes from "./routes/cohereRoutes.js";
import openaiRoutes from "./routes/openaiRoutes.js";
import huggingfaceRoutes from "./routes/huggingfaceRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Server is running and ready to handle embedding requests!",
  });
});

app.use("/api/cohere", cohereRoutes);
app.use("/api/openai", openaiRoutes);
app.use("/api/huggingface", huggingfaceRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

server.setTimeout(200000);
