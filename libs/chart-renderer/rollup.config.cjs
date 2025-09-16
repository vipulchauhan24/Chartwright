const { withNx } = require('@nx/rollup/with-nx');
const ejs = require('ejs');
const { readFileSync } = require('fs');
const { resolve, basename } = require('path');

function ejsToHtmlPlugin(options = {}) {
  return {
    name: 'ejs-to-html',
    buildStart() {
      const inputFile = resolve(options.input);
      const template = readFileSync(inputFile, 'utf-8');

      // Render with data (if any)
      const html = ejs.render(template, options.data || {});

      // Emit into output folder
      this.emitFile({
        type: 'asset',
        fileName: basename(inputFile, '.ejs') + '.html',
        source: html,
      });
    },
  };
}

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
      ejsToHtmlPlugin({
        input: 'src/chart.ejs', // your EJS file
        data: {}, // optional data for rendering
      }),
    ],
  }
);
