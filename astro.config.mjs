// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  fonts: [
    {
      // Body copy and the hero mask both. One variable family across 400-900
      // means the heavy cut the canvas rasterises is the same design as the
      // text, and it ships as a single file.
      provider: fontProviders.google(),
      name: 'Archivo',
      cssVariable: '--font-body',
      weights: ['400 900'],
      styles: ['normal'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      // Wordmark only. Pen calligraphy: the thick-thin of a nib is what carries
      // the written quality. Bold, because the regular cut is too fine to hold
      // up against the graphite at header size.
      provider: fontProviders.google(),
      name: 'Tangerine',
      cssVariable: '--font-display',
      weights: [700],
      styles: ['normal'],
      fallbacks: ['cursive'],
    },
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
