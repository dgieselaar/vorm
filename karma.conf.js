/*global module*/

var webpackConfig = require('./webpack.config');

var spartaLoader;

spartaLoader =
	{
		test: /\.js$/,
		loader: 'isparta',
		exclude: [ /node_modules/, /test/ ]
	};

webpackConfig.module.preLoaders = webpackConfig.module.preLoaders ? webpackConfig.module.preLoaders.concat(spartaLoader) : [ spartaLoader ];


module.exports = function ( config ) {
	
	config.set({
		basePath: '.',
		autoWatch: true,
		frameworks: [ 'jasmine' ],
		browsers: [ 'PhantomJS'],
		plugins: [
			require('karma-phantomjs-launcher'),
			require('karma-jasmine'),
			require('karma-webpack'),
			require('karma-coverage'),
			require('phantomjs-polyfill'),
			require('karma-sourcemap-loader')
		],
		reporters: [ 'dots', 'coverage' ],
		preprocessors: {
			'test/index.js': [ 'webpack', 'sourcemap' ]
		},
		webpack: webpackConfig,
		webpackServer: {
			noInfo: true
		}
	});
	
};
