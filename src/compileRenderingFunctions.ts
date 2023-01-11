import fs from "fs";
import ejs from "ejs";
import path, { ParsedPath } from "path";
import { readFile } from "./utils";

import { RenderingFunctions, Config } from "./types";

enum SupportedExtensions {
  ejs = '.ejs',
  html = '.html',
}

const renderFunctionFromFile = (
  config: Config,
  filePath: string
): RenderingFunctions => {
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
): RenderingFunctions => {
  return templatesDir.reduce<RenderingFunctions>(
    (compileRenderingFunctions: RenderingFunctions, directory: string) => {
      let newTemplateFunctions: RenderingFunctions = {};

      const files = fs.readdirSync(path.resolve(directory));

      files.forEach((file) => {
        const renderFunction: RenderingFunctions = renderFunctionFromFile(
          config,
          path.resolve(directory, file)
        );

        newTemplateFunctions = { ...newTemplateFunctions, ...renderFunction };
      });

      return { ...compileRenderingFunctions, ...newTemplateFunctions };
    },
    {} as RenderingFunctions
  );
};

const compileRenderingFunctions = (config: Config): RenderingFunctions => {
  const { templatesDir } = config;
  
  const renderingFunctions = renderFunctionsFromDirectories(config, templatesDir)

  return renderingFunctions
};

export { compileRenderingFunctions };
