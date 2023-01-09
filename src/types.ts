export type Initialise = (additionalConfig?: Config) => Promise<({ document, data }: PdfRequest) => Promise<Buffer>>

export interface Config {
  templatesDir: string[];
  ejsOptions: ejs.Options;
}

export interface PdfRequest {
  document: string;
  data: object;
}