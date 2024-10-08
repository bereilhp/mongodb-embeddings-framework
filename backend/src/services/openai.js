import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateOpenAIEmbedding = async (texts) => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: texts,
    });

    const embeddings = response.data.map((item) => item.embedding);
    return embeddings;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
};
