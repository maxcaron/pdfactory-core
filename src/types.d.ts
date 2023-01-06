export interface Config {
  partialsDir: string[];
  partialsFile: string[];
  templatesDir: string[];
  templatesFile: string[];
  ejsOptions: ejs.Options;
}

export interface TemplateFunctions {
  [document: string]: ejs.TemplateFunction;
}

export interface TemplateFunctions {
  [document: string]: ejs.TemplateFunction;
}