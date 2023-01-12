# pdfactory-core
- Generate pdf documents from html files. 
- Generate dynamic pdf documents using ejs files as templates. 

## Supports
- **html**
- **ejs**
## Installation
```
yarn add pdfactory-code
```

## Example using ejs and express

### Directory structure
```
/main.js
/templates
  /partials
    /page1.ejs
  /document.ejs
```
### document.ejs
```
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
</head>

<body>
  <div>
  <%- include('./partials/page1.ejs'); -%>
  </div>
</body>

</html>
```

### page1.ejs
```
<div>
  <%= title %>
</div>
```

### main.js
```
const express = require("express");
const path = require("path");
const { pdfactory } = require("pdfactory-core");

const templatesDir = path.join(__dirname, "templates");
const partialsDir = path.join(__dirname, "templates", "partials");

const DEFAULT_CONFIG = {
  templatesDir: [templatesDir, partialsDir],
  ejsOptions: {
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
```

### Example request
```
POST https://localhost:3000
{
    "document": "document",
    "data": {
        "title": "pdfactory pdf"
    }
}
```