import puppeteer, { Browser, PDFOptions } from "puppeteer";

const LastConnection500ms = "networkidle0";

export const htmlToPdf = async (
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

export const launchBrowser = async (): Promise<Browser> => {
  return await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
};
