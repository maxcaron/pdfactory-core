import { Browser } from 'puppeteer';

import {
  compileRenderingFunctions,
  renderHtmlStrings,
  RenderedHtmlStrings,
  renderHtmlStringsFromRequest
} from './renderingFunctions';
import {
  PdfRequest,
  Pdfactory,
  RenderingFunctions,
  PdfactoryError,
  ErrorType,
  PdfactoryInitializationParams
} from './types';
import { htmlStringsToPdf } from './htmlStringsToPdf';
import { launchBrowser } from './browser';
import { DEFAULT_EJS_CONFIG, DEFAULT_PDF_OPTIONS, CUSTOM_PDF_OPTIONS, DEFAULT_PDFACTORY_CONFIG } from './constants';
import { logger } from './logger.js';

let browser: Browser;
let renderingFunctions: RenderingFunctions;

const pdfactory: Pdfactory = async (params: PdfactoryInitializationParams) => {
  const { config = DEFAULT_PDFACTORY_CONFIG, ejsConfig = DEFAULT_EJS_CONFIG, pdfOptions = DEFAULT_PDF_OPTIONS } = params;

  browser = await launchBrowser();

  if(config.useFileSystem){
    try {
      renderingFunctions = compileRenderingFunctions(
        ejsConfig
      ) as RenderingFunctions;
      logger.debug(renderingFunctions);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  return async (
    pdfRequest: PdfRequest
  ): Promise<
    | Buffer
    | PdfactoryError<
        ErrorType.DocumentNotFoundError | ErrorType.DocumentNotFoundError
      >
  > => {
    try {
      if (!config.useFileSystem) {
        const {document, header, footer} = renderHtmlStringsFromRequest(ejsConfig, pdfRequest);

        const pdf: Buffer = await htmlStringsToPdf(browser, document, {
          ...pdfOptions,
          displayHeaderFooter: !!(header || footer),
          headerTemplate: header,
          footerTemplate: footer,
        });

        return pdf;
      } else {
        const { renderedHtml, headerTemplate, footerTemplate } =
        renderHtmlStrings(
          renderingFunctions,
          pdfRequest
        ) as RenderedHtmlStrings;

        const pdf: Buffer = await htmlStringsToPdf(browser, renderedHtml, {
          ...pdfOptions,
          displayHeaderFooter: !!(headerTemplate || footerTemplate),
          headerTemplate,
          footerTemplate,
        });

        return pdf;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

export { pdfactory };
