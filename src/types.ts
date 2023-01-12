import { PDFOptions as PuppeteerPDFOptions } from 'puppeteer';

export type DocumentNotFoundError = 'DocumentNotFoundError'
export type DocumentRenderingError = 'DocumentRenderingError'
export type UnsupportedFileTypeError = 'UnsupportedFileTypeError'

export type PDFOptions = Omit<
PuppeteerPDFOptions,
'headerTemplate' | 'footerTemplate' | 'displayHeaderFooter'
>

export interface PdfactoryError {
  type: DocumentNotFoundError | DocumentRenderingError
  message: string
}

export type Pdfactory = (
  additionalConfig: Config,
  pdfOptions: PDFOptions
) => Promise<
({
  document,
  data
}: PdfRequest) => UnsupportedFileTypeError | Promise<Buffer | PdfactoryError>
>

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
