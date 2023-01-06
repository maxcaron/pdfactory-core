import fs from "fs";
import ejs from "ejs";
import path, { ParsedPath } from "path";
import { readFile } from "./utils.js";

import { TemplateFunctions, Config } from "./types.js";

enum SupportedExtensions {
  ejs = '.ejs',
  html = '.html',
}

const renderFunctionFromFile = (
  config: Config,
  filePath: string
): TemplateFunctions => {
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
  } else {
    return {};
  }
};

const renderFunctionsFromDirectories = (
  config: Config,
  templatesDir: string[]
): TemplateFunctions => {
  return templatesDir.reduce<TemplateFunctions>(
    (compileRenderingFunctions: TemplateFunctions, directory: string) => {
      let newTemplateFunctions: TemplateFunctions = {};

      const files = fs.readdirSync(path.resolve(directory));

      files.forEach((file) => {
        const renderFunction: TemplateFunctions = renderFunctionFromFile(
          config,
          path.resolve(directory, file)
        );

        newTemplateFunctions = { ...newTemplateFunctions, ...renderFunction };
      });

      return { ...compileRenderingFunctions, ...newTemplateFunctions };
    },
    {} as TemplateFunctions
  );
};

const compileRenderingFunctions = (config: Config): TemplateFunctions => {
  const { templatesDir } = config;

  return renderFunctionsFromDirectories(config, templatesDir);
};

export { compileRenderingFunctions };
