import { readFileSync } from 'fs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';

import dotenv from 'dotenv';
dotenv.config({
  path: process.cwd() + `/config/.env.${process.env.DEV ? 'dev' : 'procution'}`
});

const devMode = process.env.NODE_ENV === 'development';

const pkg = JSON.parse(readFileSync('./package.json'));

const tsConfig = JSON.parse(readFileSync('./tsconfig.json'));
tsConfig.compilerOptions.outDir = devMode ? './build' : './dist';

export default defineConfig([
  {
    input: './src/pdfactory.ts',
    output: [
      ...(!devMode
        ? [
          {
            file: 'dist/pdfactory.umd.cjs',
            format: 'cjs',
            inlineDynamicImports: true
          }
        ]
        : []),
      ...(devMode
        ? [
          {
            file: 'build/bundle.js',
            format: 'es'
          }
        ]
        : [])
    ],
    external: Object.keys(pkg.dependencies),
    plugins: [
      del({
        targets: [
          ...(!devMode ? ['dist/**/*'] : []),
          ...(devMode ? ['build/**/*'] : [])
        ]
      }),
      ...(!devMode ? [terser()] : []),
      typescript(tsConfig),
      nodeResolve()
    ]
  }
]);
