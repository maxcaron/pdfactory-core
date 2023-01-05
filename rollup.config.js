import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

const devMode = (process.env.NODE_ENV === 'development');

export default [{
  input: './src/main.ts',
  output: {
      file: `dist/pdfactory.umd.cjs`,
      format: 'cjs',
      exports: 'default',
      inlineDynamicImports: true,
  },
  plugins: [
    typescript({
      sourceMap: devMode,
    }),
    // nodeResolve({preferBuiltins: true}),
    commonjs(),
    json()
  ]
}]
