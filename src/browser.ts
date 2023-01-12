import puppeteer, { Browser } from "puppeteer";

export const launchBrowser = async (): Promise<Browser> => {
  return await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
};
