import { Browser, PDFOptions } from 'puppeteer';

const LastConnection500ms = 'networkidle0';

export const htmlStringsToPdf = async (
  browser: Pick<Browser, 'newPage'>,
  renderedHtml: string,
  pdfOptions: PDFOptions,
  css: string
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

  console.log(wrapper);
  
  await page.setContent(wrapper, { waitUntil: LastConnection500ms });

  const pdf: Buffer = await page.pdf(pdfOptions);

  await page.close();

  return pdf;
};
