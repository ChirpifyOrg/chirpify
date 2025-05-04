import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import nextPlugin from '@next/eslint-plugin-next';

/** @type {import('eslint').Linter.Config[]} */
export default [
   {
      ignores: [
         '.next/**',
         'eslint.config.mjs', // Ignore ESLint config file
         'postcss.config.js', // Ignore PostCSS config file
      ],
      files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
      languageOptions: {
         globals: {
            ...globals.browser,
            React: 'readonly',
            module: 'readonly',
         },
         parser: tseslint.parser,
         parserOptions: {
            ecmaFeatures: {
               jsx: true,
            },
            project: './tsconfig.json',
         },
      },
      plugins: {
         react: pluginReact,
         '@typescript-eslint': tseslint.plugin,
         next: nextPlugin,
         // ...nextPlugin.configs.recommended.rules, // Next.js 기본 규칙 추가
      },
      rules: {
         'react/react-in-jsx-scope': 'off',
         'react/jsx-uses-react': 'off',
         'react/prop-types': 'off',
         '@typescript-eslint/no-empty-interface': 'off',
         'no-unused-vars': 'off',
         '@typescript-eslint/no-unused-vars': [
            'error',
            {
               argsIgnorePattern: '^_',
               varsIgnorePattern: '^_',
               caughtErrorsIgnorePattern: '^_',
            },
         ],
         'next/no-html-link-for-pages': 'error',
         'next/no-img-element': 'warn',
      },
      settings: {
         react: {
            version: 'detect',
         },
      },
   },
];
