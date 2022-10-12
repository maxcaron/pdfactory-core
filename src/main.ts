import { templateFunctions } from "./templateFunctions"
import puppeteer, { Browser, PDFOptions } from 'puppeteer'
import merge from 'lodash.merge'

const LastConnection500ms = "networkidle0";

const generateWithBrowser = async (browser: Browser, renderedHtml: string, pdfOptions: PDFOptions): Promise<Buffer> => {
  const page = await browser.newPage();
  await page.setContent(renderedHtml, { waitUntil: LastConnection500ms });

  const pdf: Buffer = await page.pdf(pdfOptions);

  await page.close();

  return pdf;
};

export interface TemplateFunctions {
  [document: string]: ejs.TemplateFunction;
}


export interface Config {
  partialsDir: string[];
  partialsFile: string[];
  templatesDir: string[];
  templatesFile: string[];
  ejsOptions: ejs.Options;
}

const defaultEjsOptions: ejs.Options = {
  root: "src",
  views: ["src/templates"] // For relative paths
};


const defaultConfig: Config = {
  partialsDir: ["./partials"],
  partialsFile: [],
  templatesDir: ["./templates"],
  templatesFile: [],
  ejsOptions: defaultEjsOptions
}

export interface PdfRequest {
  document: string;
  data: object;
}

const pdfOptions: PDFOptions = {
  format: "letter",
  displayHeaderFooter: true,
  headerTemplate: "",
  footerTemplate: "",
  margin: {
    top: "60px",
    bottom: "60px",
    left: "40px",
    right: "40px",
  },
}

const initialise = async (additionalConfig?: Config) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH,
    args: ["--no-sandbox"],
  })

  const config = merge(defaultConfig, additionalConfig)

  return async ({document, data}: PdfRequest) => {
    // compile documents given config
    const functions: TemplateFunctions = templateFunctions(config);

    // render html document string
    const renderedHtml: string = functions[document](data);

    // compile pdf
    const pdf: Buffer = await generateWithBrowser(browser, renderedHtml, pdfOptions);

    return pdf
  }
} 

export default initialise
