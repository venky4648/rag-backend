import { searchSimilarChunks } from "../utils/searchSimilarChunks.js";
import { generateAnswer } from "../utils/gemini.js";

export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Retrieve chunks
    const results = await searchSimilarChunks(question);

    // Build context
    const context = results
      .map((item) => item.content)
      .join("\n");

    let answer = "";

    try {
      // Try Gemini first
      answer = await generateAnswer(
        question,
        context
      );
    } catch (error) {
      console.log(
        "Gemini failed:",
        error.message
      );

      // Fallback to semantic retrieval
      answer =
        results[0]?.content ||
        "Answer not found in document.";
    }

    res.status(200).json({
      success: true,
      question,
      answer,
      retrievedChunks: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};