import express from "express";
import { connectToDatabase, closeDatabase } from "../db/mongodb.js";

const router = express.Router();

router.post("/delete-field", async (req, res) => {
  let db = null;
  try {
    const { fieldName, collectionName } = req.body;

    if (!fieldName || !collectionName) {
      return res.status(400).json({
        error: "Invalid input. 'fieldName' and 'collectionName' are required.",
      });
    }

    db = await connectToDatabase();

    const result = await db
      .collection(collectionName)
      .updateMany({}, { $unset: { [fieldName]: "" } });

    res.json({
      message: `${result.modifiedCount} documents updated successfully, field '${fieldName}' removed.`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to delete field from documents" });
  } finally {
    if (db) {
      await closeDatabase();
    }
  }
});

export default router;
