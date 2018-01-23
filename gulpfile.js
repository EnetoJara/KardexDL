/**
NO tocar © Ernesto Jara Olveda
**/
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', './server/**/*.js'];

gulp.task('style', function () {
	return gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {
			verbose: true
		}))
		.pipe(jscs());
});

gulp.task('inject', function () {
	var wiredep = require('wiredep').stream;
	var inject = require('gulp-inject');

	var injectSrc = gulp.src(
			['./public/CSS/*.css',
      './public/JS/*.js'], {
			read: false
		});

	var injectOptions = {
		ignorePath: '/public'
	};

	var options = {
		bowerJson: require('./bower.json'),
		directory: './public/lib',
		ignorePath: '../public'
	};

	return gulp.src('./views/header.ejs')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./views'));

});

gulp.task('serve', ['style', 'inject'], function () {
	var options = {
    exec: 'node --inspect ',
		script: 'bin/www',
		delayTime: 1,
		env: {
			'PORT': 3000
		},
		watch: jsFiles
	};

	return nodemon(options)
		.on('restart', function (ev) {
			console.log('KardexDL está corriendo');
		});
});
