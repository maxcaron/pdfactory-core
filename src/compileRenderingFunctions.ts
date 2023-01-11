import fs from "fs";
import ejs from "ejs";
import path, { ParsedPath } from "path";
import { readFile } from "./utils";

import {
  RenderingFunctions,
  Config,
  PdfactoryError,
  PdfRequest,
  UnsupportedFileTypeError,
} from "./types";

enum SupportedExtensions {
  ejs = ".ejs",
  html = ".html",
}

const renderFunctionFromFile = (
  config: Config,
  filePath: string
): RenderingFunctions | UnsupportedFileTypeError => {
  const parsedPath: ParsedPath = path.parse(filePath);
  const filename = parsedPath.name;

  if (parsedPath.ext === SupportedExtensions.ejs) {
    return {
      [filename]: ejs.compile(
        readFile(path.resolve(parsedPath.dir, parsedPath.base)),
        {
          ...config.ejsOptions,
          filename,
          async: false,
          cache: true,
        }
      ) as ejs.TemplateFunction,
    };
  } else if (parsedPath.ext === SupportedExtensions.html) {
    return {
      [filename]: ejs.compile(
        readFile(path.resolve(parsedPath.dir, parsedPath.base)),
        {
          ...config.ejsOptions,
          filename,
          async: false,
          cache: true,
        }
      ) as ejs.TemplateFunction,
    };
  } else if (parsedPath.ext !== "") {
    throw {
      type: "UnsupportedFileTypeError",
      message: `File "${filename}${parsedPath.ext}" has unsupported file type. Supported types: .ejs, .html`,
    };
  } else {
    return {};
  }
};

const renderFunctionsFromDirectories = (
  config: Config,
  templatesDir: string[]
): RenderingFunctions | UnsupportedFileTypeError => {
  return templatesDir.reduce<RenderingFunctions>(
    (compileRenderingFunctions: RenderingFunctions, directory: string) => {
      let newTemplateFunctions: RenderingFunctions = {};

      const files = fs.readdirSync(path.resolve(directory));

      files.forEach((file) => {
        const renderFunction: RenderingFunctions = renderFunctionFromFile(
          config,
          path.resolve(directory, file)
        ) as RenderingFunctions;

        newTemplateFunctions = { ...newTemplateFunctions, ...renderFunction };
      });

      return { ...compileRenderingFunctions, ...newTemplateFunctions };
    },
    {} as RenderingFunctions
  );
};

const compileRenderingFunctions = (
  config: Config
): RenderingFunctions | UnsupportedFileTypeError => {
  const { templatesDir } = config;

  const renderingFunctions = renderFunctionsFromDirectories(
    config,
    templatesDir
  );

  return renderingFunctions;
};

export interface RenderedHtmlStrings {
  renderedHtml: string;
  headerTemplate: string | undefined;
  footerTemplate: string | undefined;
}

const renderHtmlStrings = (
  renderingFunctions: RenderingFunctions,
  { document, data, header, footer }: PdfRequest
): RenderedHtmlStrings | PdfactoryError => {
  let renderedHtml = "";
  let headerTemplate: string | undefined;
  let footerTemplate: string | undefined;

  const renderFunction: ejs.TemplateFunction = renderingFunctions[document];

  if (!renderFunction) {
    throw { type: "DocumentNotFoundError", message: "Document not found" };
  }

  try {
    renderedHtml = renderFunction(data);

    if (header) {
      headerTemplate = renderingFunctions[header](data);
    }

    if (footer) {
      footerTemplate = renderingFunctions[footer](data);
    }
  } catch (e) {
    throw {
      type: "ErrorRenderingDocumentError",
      message: "Error rendering document",
    };
  }

  return { renderedHtml, headerTemplate, footerTemplate };
};

export { compileRenderingFunctions, renderHtmlStrings };
