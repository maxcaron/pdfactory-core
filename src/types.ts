import { PDFOptions } from "puppeteer";

export type DocumentNotFoundError = "DocumentNotFoundError";
export type ErrorRenderingDocumentError = "ErrorRenderingDocumentError";
export type UnsupportedFileTypeError = "UnsupportedFileTypeError";

export interface PdfactoryError {
  type: DocumentNotFoundError | ErrorRenderingDocumentError;
  message: string;
}

export type Pdfactory = (
  additionalConfig: Config,
  pdfOptions: PDFOptions
) => Promise<
  ({ document, data }: PdfRequest) => UnsupportedFileTypeError | Promise<Buffer | PdfactoryError>
>;

export interface Config {
  templatesDir: string[];
  ejsOptions: ejs.Options;
}

export interface PdfRequest {
  document: string;
  header?: string;
  footer?: string;
  data: object;
}

export interface RenderingFunctions {
  [document: string]: ejs.TemplateFunction;
}