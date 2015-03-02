/*global module*/

module.exports = function ( config ) {
	
	config.set({
		basePath: '.',
		autoWatch: true,
		frameworks: [  'jasmine' ],
		browsers: [ 'PhantomJS'],
		plugins: [
			'karma-phantomjs-launcher',
			'karma-jasmine',
			'karma-babel-preprocessor',
			'karma-coverage'
		],
		reporters: [ 'progress', 'coverage' ],
		preprocessors: {
			'./src/**/*.js': [ 'babel', 'coverage' ]
		},
		babelPreprocessor: {
			options: {
				auxiliaryComment: 'istanbul ignore next'
			}
		}
	});
	
};
