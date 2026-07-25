// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  fonts: [
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
