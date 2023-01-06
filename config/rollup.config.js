import pkg from "../package.json" assert { type: "json" };
import * as url from "url";

dotenv.config({ path: "./.env" });

import path from "path";
import dotenv from "dotenv";
import eslint from "@rollup/plugin-eslint";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));

const devMode = process.env.NODE_ENV === "development";

export default [
  {
    input: "./src/index.ts",
    output: {
      file: `dist/pdfactory.umd.cjs`,
      format: "cjs",
      exports: "default",
      inlineDynamicImports: true,
    },
    external: Object.keys(pkg.dependencies),
    plugins: [
      nodeResolve({ preferBuiltins: true, rootDir: path.join(dirname, "..") }),
      typescript({ tsconfig: path.join(dirname, "./tsconfig-production.json") }),
      eslint({
        fix: true,
        exclude: [
          "./node_modules",
          "node_modules/**/*",
          "dist/**/*",
          "build/**/*",
        ],
      }),
      commonjs(),
      json(),
      ...(!devMode ? [terser()] : []),
    ],
  },
];
