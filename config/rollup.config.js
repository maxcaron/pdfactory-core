import pkg from "../package.json" assert { type: "json" };
import * as url from "url";

dotenv.config({
  path: process.cwd() + `/config/.env.${process.env.DEV ? "dev" : "procution"}`,
});

import path from "path";
import dotenv from "dotenv";
import eslint from "@rollup/plugin-eslint";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));

const devMode = process.env.NODE_ENV === "development";

export default [
  {
    input: "./src/index.ts",
    watch: {
      include: ["./src/**/*", "./test/**/*"],
    },
    output: [
      ...(!devMode
        ? [
            {
              file: `dist/pdfactory.umd.cjs`,
              format: "cjs",
              exports: "default",
              inlineDynamicImports: true,
            },
          ]
        : []),
      ...(devMode
        ? [
            {
              file: "build/bundle.js",
              format: "es",
              sourcemap: true,
              plugins: [],
            },
          ]
        : []),
    ],
    external: Object.keys(pkg.dependencies),
    plugins: [
      del({
        targets: [
          ...(devMode ? ["dist/**/*"] : []),
          ...(devMode ? ["build/**/*"] : []),
        ],
      }),
      ...(!devMode ? [terser()] : []),
      nodeResolve({ preferBuiltins: true, rootDir: path.join(dirname, "..") }),
      typescript({
        tsconfig: path.join(dirname, "./tsconfig-local.json"),
      }),
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
    ],
  },
];
