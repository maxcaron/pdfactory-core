import puppeteer, { Browser } from 'puppeteer';

export const launchBrowser = async (): Promise<Browser> => {
  return await puppeteer.launch({
    headless: process.env.PDFACTORY_DEBUG !== 'true',
    args: ['--no-sandbox'],
    ignoreDefaultArgs: ['--disable-extensions']
  });
};
