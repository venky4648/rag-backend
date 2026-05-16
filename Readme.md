# RAG Backend

A backend service for a Retrieval-Augmented Generation (RAG) application built with Node.js and Express.

## Features

- Express server with REST API routes
- File upload handling with Multer and file type validation
- Supported upload formats: PDF, DOCX, XLSX, XLS, TXT
- Text extraction, chunking, and embedding generation
- JSON-based local vector store at `vectorstore/vectors.json`
- Automatic cleanup of uploaded files when processing fails
- Question/answer endpoint for retrieval-based queries
- CORS support and environment variable configuration

## Prerequisites

- Node.js 18+ installed
- npm available
- OpenAI API key (or other configured embedding API credentials)

## Setup

1. Clone the repository or copy the project files.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with your settings, for example:

```env
OPENAI_API_KEY=your-openai-api-key
PORT=3000
```

4. Start the server:

```bash
npm run dev
```

or:

```bash
npm start
```

## Entry Point

- The backend starts from `server.js`.
- The server exposes the upload route at `/api/files/upload`.
- Question routes are available under `/api/questions`.

## Upload Behavior

- Files are first uploaded to the `uploads/` folder by Multer.
- Supported file extensions are validated before upload is accepted.
- After upload, the backend extracts text, chunks it, generates embeddings, and stores vectors locally.
- If any processing step fails, the uploaded file is deleted so only successful uploads remain.

## Available Scripts

- `npm install` - install dependencies
- `npm start` - run the server with Node
- `npm run dev` - run the server with Nodemon for local development

## Project Structure

- `server.js` - Express application entry point
- `routes/` - API route definitions
- `controllers/` - request handlers
- `middleware/` - upload middleware and validation
- `utils/` - text extraction, chunking, embeddings, similarity helpers
- `vectorstore/` - local JSON vector store
- `uploads/` - temporary uploaded files

## Dependencies

- `express`
- `cors`
- `dotenv`
- `multer`
- `pdf-parse`
- `mammoth`
- `xlsx`
- `langchain`
- `openai`
- `@langchain/openai`
- `@langchain/textsplitters`
- `@google/generative-ai`

## License

ISC
