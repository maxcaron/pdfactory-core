import puppeteer, { Browser, PDFOptions } from "puppeteer";

import { compileRenderingFunctions } from "./compileRenderingFunctions";
import { Config, PdfRequest, Pdfactory, RenderingFunctions, PdfactoryError } from "./types";

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

const DEFAULT_EJS_CONFIG: Config = {
  templatesDir: [],
  ejsOptions: defaultEjsOptions,
};

const DEFAULT_PDF_OPTIONS: PDFOptions = {
  format: "a4",
  printBackground: true,
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

const pdfactory: Pdfactory = async (config = DEFAULT_EJS_CONFIG, pdfOptions = DEFAULT_PDF_OPTIONS) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    ignoreDefaultArgs: ['--disable-extensions'],
  })

  const renderingFunctions: RenderingFunctions =
    compileRenderingFunctions(config);

  return async ({ document, data, header, footer }: PdfRequest): Promise<Buffer | PdfactoryError> => {
    const renderFunction: ejs.TemplateFunction = renderingFunctions[document];
    let headerTemplate: string | null = null
    let footerTemplate: string | null = null

    if (!renderFunction) {
      return Promise.reject({ type: 'DocumentNotFoundError', message: 'Document not found' })
    }

    let renderedHtml: string = '';

    try {
      renderedHtml = renderFunction(data);

      if (header) {
        headerTemplate = renderingFunctions[header](data)
      }

      if (footer) {
        footerTemplate = renderingFunctions[footer](data)
      }
    } catch (e) {
      return Promise.reject({ type: 'ErrorRenderingDocumentError', message: 'Error rendering document', error: e })
    }
    console.log(headerTemplate)
    const pdf: Buffer = await generateWithBrowser(
      browser,
      renderedHtml,
      {
        ...pdfOptions,
        displayHeaderFooter: headerTemplate !== null || footerTemplate !== null,
        headerTemplate: headerTemplate ?? pdfOptions.headerTemplate,
        footerTemplate: footerTemplate  ?? pdfOptions.footerTemplate,
      }
    );

    return pdf;
  };
};

export { pdfactory };
