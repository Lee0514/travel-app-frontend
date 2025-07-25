import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{js,jsx}'],
		plugins: {
			prettier: eslintPluginPrettier,
		},
		extends: [
			js.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
			prettier,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		rules: {
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
			'prettier/prettier': [
				'error',
				{
					semi: false,
					singleQuote: true,
					printWidth: 100,
					trailingComma: 'es5',
					tabWidth: 2,
					useTabs: true,
				},
			],
		},
	},
])
