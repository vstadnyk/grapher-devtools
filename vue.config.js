const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
	lintOnSave: false,
	productionSourceMap: false,
	filenameHashing: false,
	publicPath: '/dev',
	outputDir: '../grapher/apps/gui/dev',
	runtimeCompiler: false,
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
		config.plugins.delete('prefetch')
		config.module
			.rule('graphql')
			.test(/\.(graphql|gql)$/)
			.use('graphql-tag/loader')
			.loader('graphql-tag/loader')
			.end()
	},
	devServer: {
		compress: false,
		port: 8081,
		disableHostCheck: true,
		overlay: {
			warnings: true,
			errors: true
		}
	},
	css: {
		modules: false
	}
}
