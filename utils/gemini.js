import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let model = null;

function initializeGemini() {
  // Check if already initialized
  if (genAI && model) {
    return;
  }

  // Validate API key exists
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not defined. Check your .env file."
    );
  }

  console.log("Initializing Gemini API...");
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b",
});
  console.log("✓ Gemini API initialized successfully");
}

export const generateAnswer = async (
  question,
  context
) => {
  try {
    // Initialize Gemini on first call (after dotenv is loaded)
    initializeGemini();

    if (!question || !context) {
      throw new Error("Question and context are required");
    }

    const prompt = `
You are a helpful AI assistant.

Answer ONLY from the provided context.

If answer is not available, say:
"Answer not found in document."

Context:
${context}

Question:
${question}
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    throw new Error(
      `Gemini API Error: ${error.message}`
    );
  }
};
