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
  config: PdfactoryConfig,
  additionalConfig: EjsConfig,
  pdfOptions: PDFOptions
) => Promise<
  ({
    document,
    data
  }: PdfRequest) => Promise<Buffer | PdfactoryError<ErrorType.DocumentNotFoundError | ErrorType.DocumentRenderingError>>
> | PdfactoryError<ErrorType.UnsupportedFileTypeError>

export interface PdfactoryConfig {
  useFileSystem: boolean
}

export interface EjsConfig {
  templatesDir: string[]
  ejsOptions: ejs.Options,
}

export interface PdfRequest {
  document: string
  header?: string
  footer?: string
  data: object
  useLocalFiles?: boolean
}

export type RenderingFunctions = Record<string, ejs.TemplateFunction>
