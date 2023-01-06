import fs from "fs";
import ejs from "ejs";
import path, { ParsedPath } from "path";
import { readFile } from "./utils.js";
import { Config } from "./types.js"

import { TemplateFunctions } from "./types.js";

const renderFunctionFromFile = (config: Config, filePath: string): TemplateFunctions => {
  const parsedPath: ParsedPath = path.parse(filePath);
  const filename = parsedPath.name;
  const isEjs = parsedPath.ext === ".ejs"

  if (isEjs) {
    return { [filename]: ejs.compile(readFile(path.resolve(parsedPath.dir, parsedPath.base)), {
        ...config.ejsOptions,
        filename,
        async: false,
        cache: true
      }) as ejs.TemplateFunction
    }
  } else {
    return {}
  }
}

const renderFunctionsFromDirectories = (config: Config, templatesDir: string[]): TemplateFunctions => {
  return templatesDir.reduce<TemplateFunctions>((templateFunctions: TemplateFunctions, directory: string) => {
    let newTemplateFunctions: TemplateFunctions = {}

    const files = fs.readdirSync(path.resolve(directory));

    files.forEach(file => { 
      const renderFunction: TemplateFunctions = renderFunctionFromFile(config, path.resolve(directory, file))

      newTemplateFunctions = {...newTemplateFunctions, ...renderFunction}
    })
    
    return {...templateFunctions, ...newTemplateFunctions}
  }, {} as TemplateFunctions)
}

const renderFunctionsFromFiles = (config: Config, templatesFile: string[]): TemplateFunctions => {
  return templatesFile.reduce<TemplateFunctions>((templateFunctions: TemplateFunctions, file: string) => {
    return {
      ...templateFunctions,
      ...renderFunctionFromFile(config, file)
    }
  }, {} as TemplateFunctions);
}

const templateFunctions = (config: Config): TemplateFunctions => {
  const { templatesDir, templatesFile } = config;

  return {
    ...renderFunctionsFromDirectories(config, templatesDir),
    ...renderFunctionsFromFiles(config, templatesFile)
  }
}

export {
  templateFunctions
}
  