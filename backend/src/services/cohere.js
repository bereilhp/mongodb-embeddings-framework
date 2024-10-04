import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";

dotenv.config();

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const generateCohereEmbedding = async (texts) => {
  const input = {
    modelId: "cohere.embed-english-v3",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      texts: texts,
      input_type: "search_document",
    }),
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);

    const rawRes = response.body;
    const jsonString = new TextDecoder().decode(rawRes);
    const parsedResponse = JSON.parse(jsonString);
    return parsedResponse.embeddings;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
};
