import fs from "fs";

const VECTOR_STORE_PATH = "./vectorstore/vectors.json";

export const storeVectors = async (
  chunks,
  vectors,
  fileName
) => {
  try {
    let existingVectors = [];

    // Read existing data
    if (fs.existsSync(VECTOR_STORE_PATH)) {
      const fileData = fs.readFileSync(
        VECTOR_STORE_PATH,
        "utf-8"
      );

      existingVectors = JSON.parse(fileData);
    }

    // Create new vector entries
    const newVectors = chunks.map((chunk, index) => ({
      id: `${fileName}-${index + 1}`,

      fileName,

      chunkNumber: index + 1,

      content: chunk.pageContent,

      embedding: vectors[index],
    }));

    // Merge existing + new
    const updatedVectors = [
      ...existingVectors,
      ...newVectors,
    ];

    // Save to JSON file
    fs.writeFileSync(
      VECTOR_STORE_PATH,
      JSON.stringify(updatedVectors, null, 2)
    );

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};