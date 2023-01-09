import puppeteer, { Browser, PDFOptions } from "puppeteer";
import merge from "lodash.merge";

import { compileRenderingFunctions } from "./compileRenderingFunctions.js";
import { Config, PdfRequest, initialise, TemplateFunctions } from "./types.js";

const LastConnection500ms = "networkidle0";

const generateWithBrowser = async (
  browser: Browser,
  renderedHtml: string,
  pdfOptions: PDFOptions
): Promise<Buffer> => {
  const page = await browser.newPage();
  await page.setContent(renderedHtml, { waitUntil: LastConnection500ms });

  const pdf: Buffer = await page.pdf(pdfOptions);

  await page.close();

  return pdf;
};

const defaultEjsOptions: ejs.Options = {
  root: "src",
  views: ["src/templates"], // For relative paths
};

const defaultConfig: Config = {
  templatesDir: [],
  ejsOptions: defaultEjsOptions,
};

const pdfOptions: PDFOptions = {
  format: "letter",
  displayHeaderFooter: true,
  headerTemplate: "",
  footerTemplate: "",
  margin: {
    top: "60px",
    bottom: "60px",
    left: "40px",
    right: "40px",
  },
};

const pdfactory: initialise = async (additionalConfig?: Config) => {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreDefaultArgs: ["--disable-extensions"],
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  const config: Config = merge(defaultConfig, additionalConfig);

  const renderingFunctions: TemplateFunctions =
    compileRenderingFunctions(config);

  return async ({ document, data }: PdfRequest) => {
    const renderFunction: ejs.TemplateFunction = renderingFunctions[document];

    if (!renderFunction) {
      throw new Error(`Document ${document} not found`);
    }

    const renderedHtml = renderFunction(data);

    const pdf: Buffer = await generateWithBrowser(
      browser as Browser,
      renderedHtml,
      pdfOptions
    );

    return pdf;
  };
};

export { pdfactory };
