import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node, 
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      'no-unused-vars': 'off',
      'no-console': 'off',
      'quotes': ['warn', 'single'],
      'no-undef': 'warn',
      'no-useless-escape': 'off',
    },
  },
];