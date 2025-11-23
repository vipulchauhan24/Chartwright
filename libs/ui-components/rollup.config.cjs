const { withNx } = require('@nx/rollup/with-nx');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve').default;
const terser = require('@rollup/plugin-terser');

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: './dist',
    tsConfig: './tsconfig.lib.json',
    compiler: 'swc',
    format: ['esm'],
    exports: 'named',
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    plugins: [
      peerDepsExternal(), // ✅ auto-externalizes react, radix, etc
      resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
      commonjs(),
      terser(),
    ],
    external: (id) => /^react|react-dom|@radix-ui\//.test(id),
  }
);
