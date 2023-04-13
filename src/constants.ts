import { Options } from 'ejs';
import { PDFOptions } from 'puppeteer';
import { EjsConfig, PdfactoryConfig } from './types';

export const DEFAULT_EJS_OPTIONS: Options = {
  root: 'src',
  views: ['src/templates']
};

export const DEFAULT_EJS_CONFIG: EjsConfig = {
  templatesDir: [],
  ejsOptions: DEFAULT_EJS_OPTIONS,
};

export const DEFAULT_PDF_OPTIONS: PDFOptions = {
  format: 'letter',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '',
  footerTemplate: '',
  margin: {
    top: '60px',
    bottom: '60px',
    left: '40px',
    right: '40px'
  }
};

export const CUSTOM_PDF_OPTIONS: PDFOptions = {
  format: 'letter',
  printBackground: true,
  displayHeaderFooter: false,
  margin: {}
};

export const DEFAULT_PDFACTORY_CONFIG: PdfactoryConfig = {
  useFileSystem: true
};