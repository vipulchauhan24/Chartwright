/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/client',
    server: {
      port: 4200,
      host: 'localhost',
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Your NestJS port
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
    preview: {
      port: 4300,
      host: 'localhost',
    },
    plugins: [
      tailwindcss(),
      svgr({
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            floatPrecision: 2,
          },
        },
        include: '**/*.svg?react',
      }),
      react({
        babel: {
          presets: ['jotai/babel/preset'],
        },
      }),
      viteStaticCopy({
        targets: [
          {
            src: '../../libs/chart-renderer/dist/chart.html', // path to lib build
            dest: '.', // copy into dist/ root -> available at /chart.html
          },
        ],
      }),
    ],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  };
});
