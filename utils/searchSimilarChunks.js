import fs from "fs";

import { pipeline } from "@xenova/transformers";

import { cosineSimilarity } from "./cosineSimilarity.js";

const VECTOR_STORE_PATH = "./vectorstore/vectors.json";

let extractor;

// Load embedding model
const loadModel = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return extractor;
};

export const searchSimilarChunks = async (
  question,
  topK = 4
) => {
  try {
    // Load vectors
    const fileData = fs.readFileSync(
      VECTOR_STORE_PATH,
      "utf-8"
    );

    const storedVectors = JSON.parse(fileData);

    // Load embedding model
    const model = await loadModel();

    // Generate question embedding
    const output = await model(question, {
      pooling: "mean",
      normalize: true,
    });

    const questionEmbedding = Array.from(output.data);

    // Calculate similarities
    const scoredChunks = storedVectors.map((item) => ({
      ...item,

      similarity: cosineSimilarity(
        questionEmbedding,
        item.embedding
      ),
    }));

    // Sort descending
    scoredChunks.sort(
      (a, b) => b.similarity - a.similarity
    );

    // Return top matches
    return scoredChunks.slice(0, topK);
  } catch (error) {
    throw new Error(error.message);
  }
};