export interface Config {
    templatesDir: string[];
    ejsOptions: ejs.Options;
}
export interface TemplateFunctions {
    [document: string]: ejs.TemplateFunction;
}
export interface PdfRequest {
    document: string;
    data: object;
}
