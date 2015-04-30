/*global require,__dirname*/
var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	karma = require('karma'),
	del = require('del'),
	runSequence = require('run-sequence'),
	dgeni;
	
dgeni = (function ( ) {
	
	var pkg;
	
	return function ( ) {
		if(!pkg) {
			pkg = {
				Dgeni: require('dgeni')
			};
		}
		return pkg;
	};
	
})();
	
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

function getSrc ( ) {
	return [ 'src/**/_*.js', 'src/**/*.js' ];
}

function concatenate ( ) {	
	return gulp.src(getSrc())
			.pipe(sourcemaps.init())
				.pipe(concat('vorm.js'))
				.pipe(babel())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('.'));
}

function build ( ) {
	
	return gulp.src(getSrc())
			.pipe(sourcemaps.init())
				.pipe(concat('vorm.min.js'))
				.pipe(babel())
				.pipe(uglify())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('.'));
	
}

function docs ( done ) {
	
	var inst,
		Dgeni = dgeni().Dgeni;
		
	console.log('generating docs');
	
	del.sync('./docs/partials/api');
	inst = new Dgeni([require('./docs/dgeni-conf')]);
	
  	inst.generate()
  		.then(function ( docs ) {
  			console.log('generated ' + docs.length + ' pages');
  			done();
		});
}

gulp.task('default', function ( callback ) {
	
	gulp.watch('src/**/*.js', function ( ) {
		return runSequence('concat', 'docs');
	});
	
	gulp.watch('docs/templates/**/*.html', docs);
	
	karma.server.start({
		configFile: __dirname + '/karma.conf.js',
		files: getUnitTestFiles()
	}, callback);
	
});

gulp.task('concat', concatenate);
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

gulp.task('docs', [ 'concat' ], docs);
