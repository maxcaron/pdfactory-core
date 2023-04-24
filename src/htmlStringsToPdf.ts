import { Browser, PDFOptions } from 'puppeteer';
import { PdfactoryConfig } from './types.ts';

const LastConnection500ms = 'networkidle0';

export const htmlStringsToPdf = async (
  browser: Pick<Browser, 'newPage'>,
  renderedHtml: string,
  pdfOptions: PDFOptions,
  css: string,
  config: PdfactoryConfig
): Promise<Buffer> => {
  const page = await browser.newPage();
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

  await page.setContent(wrapper, { waitUntil: LastConnection500ms });

  const pdf: Buffer = await page.pdf(pdfOptions);

  !config.debug && await page.close();

  return pdf;
};
