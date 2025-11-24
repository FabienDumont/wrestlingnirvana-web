// eslint.config.mjs
// @ts-check

import withNuxt from './.nuxt/eslint.config.mjs';
import eslintConfigPrettier from 'eslint-config-prettier';

export default withNuxt(
  {
    ignores: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/dist/**',
      '**/app/components/ui/**',
    ],
  },
  eslintConfigPrettier,
);
