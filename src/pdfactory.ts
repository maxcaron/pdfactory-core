import { Browser } from 'puppeteer';

import {
  compileRenderingFunctions,
  renderHtmlStrings,
  RenderedHtmlStrings,
  renderHtmlStringsFromRequest,
} from './renderingFunctions.ts';
import {
  PdfRequest,
  Pdfactory,
  RenderingFunctions,
  PdfactoryError,
  ErrorType,
  PdfactoryInitializationParams,
} from './types.ts';
import { htmlStringsToPdf } from './htmlStringsToPdf.ts';
import { launchBrowser } from './browser.ts';
import {
  DEFAULT_EJS_CONFIG,
  DEFAULT_PDF_OPTIONS,
  DEFAULT_PDFACTORY_CONFIG,
} from './constants.ts';
import { logger } from './logger.ts';

let browser: Browser;
let renderingFunctions: RenderingFunctions;

const pdfactory: Pdfactory = async (params: PdfactoryInitializationParams) => {
  const {
    config = DEFAULT_PDFACTORY_CONFIG,
    ejsConfig = DEFAULT_EJS_CONFIG,
    pdfOptions = DEFAULT_PDF_OPTIONS,
  } = params;

  browser = await launchBrowser();

  if (config.useFileSystem) {
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
        const marginTop = pdfRequest.marginTop || pdfOptions.margin.top;
        const marginBottom =
          pdfRequest.marginBottom || pdfOptions.margin.bottom;

        const { document, header, footer, err } = renderHtmlStringsFromRequest(
          pdfRequest
        );

        if (err !== null) {
          return Promise.reject(err);
        }

        const pdf: Buffer = await htmlStringsToPdf(
          browser, 
          document, 
          {
            ...{
              ...pdfOptions,
              margin: { top: marginTop, bottom: marginBottom },
            },
            displayHeaderFooter: !!(header || footer),
            headerTemplate: header,
            footerTemplate: footer,
          }, 
          pdfRequest.css?.join('\n') ?? '',
        );

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
        }, '');

        return pdf;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

export { pdfactory };
