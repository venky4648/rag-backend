import fs from "fs";
import { extractText } from "../utils/extractText.js";
import { chunkText } from "../utils/chunkText.js";
import { generateEmbeddings } from "../utils/generateEmbeddings.js";
import { storeVectors } from "../vectorstore/storeVectors.js";

const deleteUploadedFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.warn("Could not delete uploaded file:", err.message);
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Extract text
    const extractedText = await extractText(
      req.file.path,
      req.file.mimetype
    );

    // Chunk text
    const chunks = await chunkText(extractedText);

    // Generate embeddings
    const vectors = await generateEmbeddings(chunks);

    // Store vectors locally
    await storeVectors(
      chunks,
      vectors,
      req.file.originalname
    );

    res.status(200).json({
      success: true,
      message:
        "File uploaded and vectors stored successfully",
      totalChunks: chunks.length,
      embeddingDimension: vectors[0]?.length,
    });
  } catch (error) {
    if (req.file?.path) {
      await deleteUploadedFile(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};