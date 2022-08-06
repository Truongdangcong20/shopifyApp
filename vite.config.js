/// <reference types="vitest" />
import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen()],
  resolve: {
    alias: [
      {find: /^assets\/(.*)/, replacement: '/src/assets/$1'},
      {find: 'client-comp', replacement: '/src/components/client'},
      {find: 'server-comp', replacement: '/src/components/server'},
      {find: 'fallback-comp', replacement: '/src/components/fallback'},
      {find: 'graphql-query', replacement: '/src/graphql/index.query'},
      {find: 'layouts', replacement: '/src/layouts/index.layouts'},
      {find: 'lib', replacement: '/src/lib/index.lib'},
      {find: /^routes\/(.*)/, replacement: '/src/routes/$1'},
      {find: /^styles\/(.*)/, replacement: '/src/styles/$1'},
    ],
  },
  optimizeDeps: {
    include: [
      '@headlessui/react',
      'clsx',
      'react-use',
      'typographic-base',
      'axios',
    ],
  },
  test: {
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
