import { pipeline } from "@xenova/transformers";

let extractor;

// Load model once
const loadModel = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return extractor;
};

export const generateEmbeddings = async (chunks) => {
  try {
    const model = await loadModel();

    const vectors = [];

    for (const chunk of chunks) {
      const output = await model(chunk.pageContent, {
        pooling: "mean",
        normalize: true,
      });

      vectors.push(Array.from(output.data));
    }

    return vectors;
  } catch (error) {
    throw new Error(error.message);
  }
};