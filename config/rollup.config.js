import * as url from "url";
import path from "path";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dotenv from "dotenv";

dotenv.config({
  path: process.cwd() + `/config/.env.${process.env.DEV ? "dev" : "procution"}`,
});

import pkg from "../package.json" assert { type: "json" };

const dirname = url.fileURLToPath(new URL(".", import.meta.url));

const devMode = process.env.NODE_ENV === "development";


export default [
  {
    input: "./src/pdfactory.ts",
    watch: {
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
              plugins: [],
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
      // ...(!devMode ? [terser()] : []),
      typescript({
        tsconfig: path.join(dirname, `./tsconfig-${devMode ? 'dev' : 'production'}.json`),
      }),
      nodeResolve()
    ],
  },
];
