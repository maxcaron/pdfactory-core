# pdfactory-core

## Installation
```
yarn add pdfactory-code
```

## Example using ejs and express

```
const express = require("express");
const path = require("path");
const { pdfactory } = require("pdfactory-core");

const templatesDir = path.join(__dirname, "templates");

const DEFAULT_CONFIG = {
  templatesDir: [templatesDir],
  ejsOptions: {
    root: "test", // Directory containing template files
    views: [templatesDir], // For relative include paths  
  },
};

const init = async () => {
  const pdfactoryHandler = await pdfactory(DEFAULT_CONFIG);

  const app = express();

  app.use(express.json());

  const requestHandler = async (req, res) => {
    let pdf = null;

    try {
      pdf = await pdfactoryHandler(req.body);
    } catch (e) {
      console.log(e)
      res.sendStatus(400);
    }
    
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

init();
