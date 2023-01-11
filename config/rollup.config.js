import * as url from "url";
import path, { resolve } from "path";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import dotenv from "dotenv";
import { BrowserFetcher } from "puppeteer";
import { defineConfig } from 'rollup';

import pkg from "../package.json" assert { type: "json" };

const downloadPath = `${process.cwd()}/dist/.local-chromium`;

const createBrowserFetcher = () => {
  return new BrowserFetcher({
    path: downloadPath,
    localRevisions: ["1045629"],
  });
};

dotenv.config({
  path: process.cwd() + `/config/.env.${process.env.DEV ? "dev" : "procution"}`,
});

const dirname = url.fileURLToPath(new URL(".", import.meta.url));

const devMode = process.env.NODE_ENV === "development";

const browserFetcher = createBrowserFetcher();
const revisionInfo = await browserFetcher.download("1045629");

if (!revisionInfo?.executablePath) {
  throw new Error("Could not find executable path for browser revision");
}

process.env.downloadPath = revisionInfo.executablePath;

export default defineConfig([
  {
    input: "./src/pdfactory.ts",
    watch: {
      clearScreen: true,
      include: ["./src/**/*", "./test/**/*"],
    },
    output: [
      ...(!devMode
        ? [
            {
              file: `dist/pdfactory.umd.cjs`,
              format: "cjs",
              inlineDynamicImports: true,
            },
          ]
        : []),
      ...(devMode
        ? [
            {
              file: "build/bundle.js",
              format: "es",
            },
          ]
        : []),
    ],
    external: Object.keys(pkg.dependencies),
    plugins: [
      del({
        targets: [
          ...(!devMode ? ["dist/**/*"] : []),
          ...(devMode ? ["build/**/*"] : []),
        ],
      }),
      ...(!devMode ? [terser()] : []),
      typescript({
        tsconfig: path.join(
          dirname,
          `./tsconfig-${devMode ? "dev" : "production"}.json`
        ),
      }),
      nodeResolve(),
    ],
  },
])
