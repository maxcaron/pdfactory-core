import { Browser, PDFOptions } from 'puppeteer';
import { PdfactoryConfig } from './types.ts';

export const htmlStringsToPdf = async (
  browser: Pick<Browser, 'newPage'>,
  renderedHtml: string,
  pdfOptions: PDFOptions,
  css: string,
  config: PdfactoryConfig
): Promise<Buffer> => {
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    request.abort();
  });

  const wrapper = `<!DOCTYPE html>
  <html>
      <head>
      <style>
          html {
              -webkit-print-color-adjust: exact;
          }
          @media print {
              ${css ?? ''}
          }
        </style>
      </head>
      <body>
          ${renderedHtml}
      </body>
  </html>`;

  await page.setContent(wrapper, { waitUntil: 'domcontentloaded' });

  const pdf: Buffer = await page.pdf(pdfOptions);

  !config.debug && await page.close();

  return pdf;
};
