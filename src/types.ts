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

export interface PdfactoryConfig {
  useFileSystem: boolean
}

export interface EjsConfig {
  templatesDir: string[]
  ejsOptions: ejs.Options,
}

export type PdfactoryInitializationParams = {
  config?: PdfactoryConfig,
  ejsConfig?: EjsConfig,
  pdfOptions?: PDFOptions
}

export type Pdfactory = (params: PdfactoryInitializationParams) => Promise<
  ({
    document,
    data
  }: PdfRequest) => Promise<Buffer | PdfactoryError<ErrorType.DocumentNotFoundError | ErrorType.DocumentRenderingError>>
> | PdfactoryError<ErrorType.UnsupportedFileTypeError>



export interface PdfRequest {
  document: string
  header?: string
  footer?: string
  data: object
  marginTop?: string
  marginBottom?: string
  css?: string[]
}

export type RenderingFunctions = Record<string, ejs.TemplateFunction>
