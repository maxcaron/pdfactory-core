import { PDFOptions as PuppeteerPDFOptions } from 'puppeteer';

export enum ErrorType {
  DocumentNotFoundError = 'DocumentNotFoundError',
  DocumentRenderingError = 'DocumentRenderingError',
  UnsupportedFileTypeError = 'UnsupportedFileTypeError'
}

export type PDFOptions = Omit<
  PuppeteerPDFOptions,
  'headerTemplate' | 'footerTemplate' | 'displayHeaderFooter'
>

export interface PdfactoryError<ErrorType> {
  type: ErrorType,
  message: string
}

export type Pdfactory = (
  additionalConfig: Config,
  pdfOptions: PDFOptions
) => Promise<
  ({
    document,
    data
  }: PdfRequest) => Promise<Buffer | PdfactoryError<ErrorType.DocumentNotFoundError | ErrorType.DocumentRenderingError>>
> | PdfactoryError<ErrorType.UnsupportedFileTypeError>

export interface Config {
  templatesDir: string[]
  ejsOptions: ejs.Options
}

export interface PdfRequest {
  document: string
  header?: string
  footer?: string
  data: object
}

export type RenderingFunctions = Record<string, ejs.TemplateFunction>
