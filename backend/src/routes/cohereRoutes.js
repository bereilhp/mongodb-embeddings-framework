import express from "express";
import { generateCohereEmbedding } from "../services/cohere.js";
import { connectToDatabase, closeDatabase } from "../db/mongodb.js";

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

router.post("/embed-field", async (req, res) => {
  let db = null;
  try {
    const { fieldName, collectionName } = req.body;

    if (!fieldName || !collectionName) {
      return res.status(400).json({
        error: "Invalid input. 'fieldName' and 'collectionName' are required.",
      });
    }

    db = await connectToDatabase();

    const documents = await db.collection(collectionName).find({}).toArray();

    const updatedDocuments = [];

    for (const doc of documents) {
      const textChunk = doc[fieldName];

      if (textChunk && !doc.embeddings) {
        try {
          const embedding = await generateCohereEmbedding([textChunk]);

          await db
            .collection(collectionName)
            .updateOne(
              { _id: doc._id },
              { $set: { embeddings: embedding[0] } }
            );

          updatedDocuments.push({ ...doc, embeddings: embedding[0] });
        } catch (error) {
          console.error(
            `Error generating embedding for document ${doc._id}:`,
            error
          );
        }
      } else {
        console.log(`Skipping document ${doc._id}, embeddings already exist.`);
      }
    }

    res.json({
      message: "Embeddings generated and stored successfully.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate and store embeddings" });
  } finally {
    if (db) {
      await closeDatabase();
    }
  }
});

export default router;
