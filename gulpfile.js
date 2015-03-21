/*global require,__dirname*/
var fs = require('fs'),
	gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	cached = require('gulp-cached'),
	plumber = require('gulp-plumber'),
	babel = require('gulp-babel-helpers'),
	uglify = require('gulp-uglify'),
	remember = require('gulp-remember'),
	concat = require('gulp-concat'),
	header = require('gulp-header'),
	addsrc = require('gulp-add-src'),
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
				blacklist: [ "useStrict" ]
			}, './helpers.js', './helpers.js'))
			.pipe(addsrc.prepend('./helpers.js'))
			.pipe(uglify())
			.pipe(remember('js'))
			.pipe(concat('vorm.js', { newLine: '' }))
			.pipe(header('"use strict";'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'))
		
	stream.on('end', function ( ) {
		fs.unlinkSync('./helpers.js');
	});
		
	return stream;
}

gulp.task('default', function ( callback ) {
	
	gulp.watch('src/**/*.js', js);
	
	karma.server.start({
		configFile: __dirname + '/karma.conf.js',
		files: getUnitTestFiles()
	}, callback);
	
});

gulp.task('build', js);

gulp.task('test', function ( callback ) {
	
	karma.server.start({
		configFile: __dirname + '/karma.conf.js',
		autoWatch: false,
		singleRun: true,
		files: getUnitTestFiles()
	}, callback);
	
});
