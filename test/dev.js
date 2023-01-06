import express from "express";
import initialise from "../build/main.js";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(dirname, "../src", "templates");
const partialsDir = path.join(dirname, "../src", "templates", "partials");

const DEFAULT_CONFIG = {
  partialsDir: [partialsDir],
  partialsFile: [],
  templatesDir: [templatesDir],
  templatesFile: [],
  ejsOptions: {
    root: "test",
    views: [templatesDir], // For relative paths
  },
};

const init = async () => {
  console.log("Server starting");
  const pdfactoryHandler = await initialise(DEFAULT_CONFIG);

  const app = express();

  app.use(express.json());

  const requestHandler = async (req, res) => {
    const pdf = await pdfactoryHandler(req.body);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
    });

    res.send(pdf);
  };

  app.post("/", requestHandler);

  app.listen(3000);

  return app;
};

await init();

console.log("Server started");
