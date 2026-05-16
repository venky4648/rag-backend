import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads folder automatically
const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    ".pdf",
    ".docx",
    ".xlsx",
    ".xls",
    ".txt",
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOCX, Excel, and TXT files are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;