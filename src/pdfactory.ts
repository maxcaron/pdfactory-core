import {
  compileRenderingFunctions,
  renderHtmlStrings,
  RenderedHtmlStrings,
} from "./compileRenderingFunctions";
import {
  PdfRequest,
  Pdfactory,
  RenderingFunctions,
  PdfactoryError,
} from "./types";
import { htmlToPdf, launchBrowser } from "./htmlToPdf";
import { DEFAULT_EJS_CONFIG, DEFAULT_PDF_OPTIONS } from "./constants";
import { Browser } from "puppeteer";

let browser: Browser;
let renderingFunctions: RenderingFunctions;

const pdfactory: Pdfactory = async (
  config = DEFAULT_EJS_CONFIG,
  pdfOptions = DEFAULT_PDF_OPTIONS
) => {
  browser = await launchBrowser();

  try {
    renderingFunctions = compileRenderingFunctions(
      config
    ) as RenderingFunctions;
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  return async (pdfRequest: PdfRequest): Promise<Buffer | PdfactoryError> => {
    const { renderedHtml, headerTemplate, footerTemplate } = renderHtmlStrings(
      renderingFunctions,
      pdfRequest
    ) as RenderedHtmlStrings;

    const pdf: Buffer = await htmlToPdf(browser, renderedHtml, {
      ...pdfOptions,
      displayHeaderFooter: !!(headerTemplate || footerTemplate),
      headerTemplate,
      footerTemplate,
    });

    return pdf;
  };
};

export { pdfactory };
