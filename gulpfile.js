/*global require,__dirname*/
var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	cached = require('gulp-cached'),
	plumber = require('gulp-plumber'),
	babel = require('gulp-babel-helpers'),
	uglify = require('gulp-uglify'),
	remember = require('gulp-remember'),
	concat = require('gulp-concat'),
	header = require('gulp-header'),
	addsrc = require('gulp-add-src'),
	runSequence = require('run-sequence'),
	karma = require('karma');
	
function getUnitTestFiles ( ) {
	return [
		'node_modules/angular/angular.js',
		'node_modules/lodash/index.js',
		'node_modules/angular-mocks/angular-mocks.js',
		'src/**/_*.js',
		'src/**/*.js',
		'test/**/*.js'
	];
}

function js ( ) {
	var stream =  gulp.src([ 'src/**/_*.js', 'src/**/*.js' ] )
		.pipe(sourcemaps.init())
			.pipe(cached('js'))
			.pipe(plumber())
			.pipe(babel( {
				blacklist: [ "useStrict" ],
				babelHelpers: {
					outputType: 'var'
				}
			}, './helpers.js', './helpers.js'))
			.pipe(uglify())
			.pipe(remember('js'))
			.pipe(concat('vorm.js', { newLine: '' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'));
		
	return stream;
}

function build ( ) {
	return runSequence('js', 'helper');
}

gulp.task('default', function ( callback ) {
	
	gulp.watch('src/**/*.js', build);
	
	karma.server.start({
		configFile: __dirname + '/karma.conf.js',
		files: getUnitTestFiles()
	}, callback);
	
});

gulp.task('js', js);

gulp.task('helper', function ( ) {
	
	var stream = gulp.src('./helpers.js')
		.pipe(uglify())
		.pipe(addsrc.append('./vorm.js'))
		.pipe(concat('vorm.js', { newLine: ''}))
		.pipe(header('"use strict";'))
		.pipe(gulp.dest('.'));
	
	return stream;
	
});

gulp.task('build', build);

gulp.task('test', function ( callback ) {
	
	karma.server.start({
		configFile: __dirname + '/karma.conf.js',
		autoWatch: false,
		singleRun: true,
		files: getUnitTestFiles()
	}, function ( ) {
		callback();
	});
	
});
