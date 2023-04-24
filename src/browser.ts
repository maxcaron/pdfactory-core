import puppeteer, { Browser } from 'puppeteer';
import { PdfactoryConfig } from './types.ts';

export const launchBrowser = async (config: PdfactoryConfig): Promise<Browser> => {
  const headless = config.debug ? false : true;
  return await puppeteer.launch({
    headless,
    args: ['--no-sandbox'],
    ignoreDefaultArgs: ['--disable-extensions']
  });
};
