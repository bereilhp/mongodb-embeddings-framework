import express from "express";
import { generateCohereEmbedding } from "../services/cohere.js";

const router = express.Router();

router.post("/embed", async (req, res) => {
  try {
    const { texts } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        error: "Invalid input. 'texts' should be an array of strings.",
      });
    }

    const embeddings = await generateCohereEmbedding(texts);
    res.json({ embeddings });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate embeddings" });
  }
});

export default router;
