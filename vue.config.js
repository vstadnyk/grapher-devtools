const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
	lintOnSave: false,
	productionSourceMap: false,
	baseUrl: '/',
	outputDir: 'dist',
	runtimeCompiler: true,
	configureWebpack: {
		resolve: {
			alias: {
				vue$: 'vue/dist/vue.esm.js'
			}
		},
		plugins: [
			new CompressionPlugin({
				test: /\.(js|css)$/,
				cache: 'cache'
			})
		]
	},
	chainWebpack: config => {
		config.module
			.rule('graphql')
			.test(/\.graphql$/)
			.use('graphql-tag/loader')
			.loader('graphql-tag/loader')
			.end()
	},
	devServer: {
		compress: true,
		port: 8082,
		disableHostCheck: true,
		overlay: {
			warnings: true,
			errors: true
		}
	},
	css: {
		modules: true
	}
}
