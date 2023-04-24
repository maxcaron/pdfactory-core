export default {
  'files': [
    'tests/unit/**/*.ts',
  ],
  'extensions': {
    'ts': 'module'
  },
  'nodeArguments': [
    '--loader=ts-node/esm',
    '--experimental-specifier-resolution=node'
  ],
};
