import { Options } from "ejs";
import { PDFOptions } from "puppeteer";
import { Config } from "./types";

export const DEFAULT_EJS_OPTIONS: Options = {
  root: "src",
  views: ["src/templates"], // For relative paths
};

export const DEFAULT_EJS_CONFIG: Config = {
  templatesDir: [],
  ejsOptions: DEFAULT_EJS_OPTIONS,
};

export const DEFAULT_PDF_OPTIONS: PDFOptions = {
  format: "a4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "",
  footerTemplate: "",
  margin: {
    top: "60px",
    bottom: "60px",
    left: "40px",
    right: "40px",
  },
};
