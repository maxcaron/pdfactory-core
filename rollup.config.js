import dotenv from ".config/dotenv";
import tsconfig from "./config/tsconfig-production.json" assert { type: "json" };

import pkg from "./package.json" assert { type: "json" };

dotenv.config();

import eslint from "@rollup/plugin-eslint";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const devMode = process.env.NODE_ENV === "development";

export default [
  {
    input: "./src/main.ts",
    output: {
      file: `dist/pdfactory.umd.cjs`,
      format: "cjs",
      exports: "default",
      inlineDynamicImports: true,
    },
    external: Object.keys(pkg.dependencies),
    plugins: [
      eslint({
        fix: true,
        exclude: [
          "./node_modules",
          "node_modules/**/*",
          "dist/**/*",
          "build/**/*",
        ],
      }),
      typescript(tsconfig),
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      ...(!devMode ? [terser()] : []),
    ],
  },
];
