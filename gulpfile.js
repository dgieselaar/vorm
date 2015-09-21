
var path = require('path'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	webpack = require('webpack'),
	del = require('del'),
	karma = require('karma'),
	runSequence = require('run-sequence'),
	config = require('./webpack.config');

var dgeni;

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

function handleCompilerRun ( err, stats ) {
	if(err) {
		gutil.log(new gutil.PluginError('webpack', err));
	} else {
		gutil.log(stats.toString({
			colors: gutil.colors.supportsColor,
			chunks: false
		}));
	}
}

function getUnitTestFiles ( ) {
	return [ './test/index.js' ];
}

function clean ( done ) {
	//del.sync('./dist', { read: false });
	done();
}

function webpackTask ( done ) {
	var compiler = webpack(config);
	compiler.run(function ( err, stats ) {
		handleCompilerRun(err, stats);
		done();
	});
}

function docs ( done ) {
	
	var inst,
		Dgeni = dgeni().Dgeni;
		
	gutil.log('generating docs');
	
	del.sync('./docs/partials/api');
	inst = new Dgeni([require('./docs/dgeni-conf')]);
	
	inst.generate()
		.then(function ( result ) {
			gutil.log('generated ' + result.length + ' pages');
		})
		.finally(function ( ) {
			done();
		});
}

function build ( done ) {
	return runSequence('clean', 'webpack', done);
}

function defaults ( ) {
	var karmaServer =
		new karma.Server({
			configFile: path.join(__dirname, 'karma.conf.js'),
			files: getUnitTestFiles(),
			autoWatch: true,
			singleRun: false
		});

	karmaServer.start();

	webpack(config)
		.watch({}, function ( err, stats ) {
			handleCompilerRun(err, stats);
		});

	gulp.watch('docs/templates/**/*.html', docs);
}

function test ( done ) {
	var server =
		new karma.Server({
			configFile: path.join(__dirname, 'karma.conf.js'),
			files: getUnitTestFiles(),
			autoWatch: false,
			singleRun: true
		});

	server.start(done);
}

gulp.task('build', build);
gulp.task('clean', clean);
gulp.task('default', defaults);
gulp.task('webpack', webpackTask);
gulp.task('test', test);
