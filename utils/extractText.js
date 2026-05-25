import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import mammoth from "mammoth";
import XLSX from "xlsx";

const extractTextFromPDF = async (filePath) => {
  const loader = new PDFLoader(filePath);

  const docs = await loader.load();

  return docs.map((doc) => doc.pageContent).join("\n");
};

const extractTextFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return result.value;
};

const extractTextFromExcel = async (filePath) => {
  const workbook = XLSX.readFile(filePath);

  let extractedText = "";

  workbook.SheetNames.forEach((sheetName) => {
    const sheetData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName],
      {
        header: 1,
      }
    );

    extractedText += JSON.stringify(sheetData);
  });

  return extractedText;
};

const extractTextFromTXT = async (filePath) => {
  return fs.readFileSync(filePath, "utf-8");
};

export const extractText = async (filePath, mimetype) => {
  try {
    if (mimetype === "application/pdf") {
      return await extractTextFromPDF(filePath);
    }

    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await extractTextFromDOCX(filePath);
    }

    if (
      mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimetype === "application/vnd.ms-excel"
    ) {
      return await extractTextFromExcel(filePath);
    }

    if (mimetype === "text/plain") {
      return await extractTextFromTXT(filePath);
    }

    return "Unsupported file type";
  } catch (error) {
    throw new Error(error.message);
  }
};