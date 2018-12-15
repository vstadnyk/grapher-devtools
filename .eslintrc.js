module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	extends: ['plugin:vue/essential', '@vue/airbnb', 'prettier'],
	rules: {
		'no-console': 'off',
		'no-debugger': 'off',
		'no-alert': 'off',
		semi: [2, 'never'],
		'comma-dangle': 0,
		'class-methods-use-this': 0,
		'no-restricted-syntax': 0,
		'prettier/prettier': 'error',
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				closeBracket: 0,
				ignores: []
			}
		]
	},
	plugins: ['vue', 'prettier', 'graphql'],
	parserOptions: {
		parser: 'babel-eslint',
		ecmaVersion: 9,
		sourceType: 'module'
	}
}
