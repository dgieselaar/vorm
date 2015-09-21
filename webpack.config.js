var path = require('path'),
	webpack = require('webpack');

var exports;

exports = {
	devtool: 'source-map',
	entry: {
		vorm: './index.js'
	},
	output: {
		path: __dirname,
		filename: '[name].js',
		chunkFilename: '[id].js'
	},
	module: {
		loaders: [
			{
				test: /.*\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					optional: [ 'runtime', 'es7.decorators' ]
				}
			},
			{
				test: /.*\.html$/,
				loader: 'html',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
	]
};

module.exports = exports;
