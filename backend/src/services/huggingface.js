import { pipeline } from "@xenova/transformers";

let extractor = null;

const initializeExtractor = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "sentence-transformers/all-MiniLM-L6-v2",
      {
        quantized: false,
      }
    );
  }
};

export const generateHuggingFaceEmbedding = async (texts) => {
  try {
    await initializeExtractor();

    const output = await extractor(texts, { normalize: true, pooling: "cls" });

    const embeddings = output.tolist();
    return embeddings;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
};
