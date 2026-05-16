import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const chunkText = async (text) => {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([text]);

    // 👇 ADD THIS DEBUG LOG HERE
    chunks.forEach((chunk, index) => {
      console.log("========== CHUNK INFO ==========");
      console.log("Chunk Index:", index);
      console.log("Content Preview:", chunk.pageContent.slice(0, 300));
      console.log("Length:", chunk.pageContent.length);
      console.log("================================");
    });

    return chunks;
  } catch (error) {
    throw new Error(error.message);
  }
};