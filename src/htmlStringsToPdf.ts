import { Browser, PDFOptions } from 'puppeteer';

const LastConnection500ms = 'networkidle0';

export const htmlStringsToPdf = async (
  browser: Pick<Browser, 'newPage'>,
  renderedHtml: string,
  pdfOptions: PDFOptions
): Promise<Buffer> => {
  const page = await browser.newPage();
  await page.setContent(renderedHtml, { waitUntil: LastConnection500ms });

  const pdf: Buffer = await page.pdf(pdfOptions);

  await page.close();

  return pdf;
};
