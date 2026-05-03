// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://h2oiswater.github.io',
  base: '/web3-upgrades',
  vite: {
    plugins: [tailwindcss()]
  }
});