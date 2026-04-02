import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.2' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // --- ТВОИ НАСТРОЙКИ ---

      // 1. Неиспользуемые переменные и импорты (оставляем, не ругаемся)
      'no-unused-vars': 'off',

      // 2. ОБЯЗАТЕЛЬНЫЙ импорт React (раз тебе так нравится)
      'react/react-in-jsx-scope': 'error',

      // 3. Самозакрывающиеся теги (делаем предупреждением)
      'react/self-closing-comp': 'warn',

      // 4. Разрешаем console.log (пусть будут видны)
      'no-console': 'off',

      // 6. Правила хуков (строгая проверка, чтобы не было багов)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 7. Отключаем prop-types (валидация типов не нужна)
      'react/prop-types': 'off',

      // 8. Одинарные кавычки везде (warn)
      'quotes': ['warn', 'single'],           // для JS кода
      'jsx-quotes': ['warn', 'prefer-single'], // для атрибутов в JSX

      // Разрешаем экспорт компонентов (стандарт Vite)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];