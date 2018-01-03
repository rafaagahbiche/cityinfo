// FED Paths

var BASE_FED = "cityinfo",
// FED Assets Paths
		SASS_FED = BASE_FED + "/style",

// FED File Paths
		SASS_FILES = SASS_FED + "/*.scss",
		BROWSER_SUPPORT = ["last 5 versions", "ie 9"],

// Include gulp
		gulp = require('gulp'),

// Include Our Plug-ins
		autoprefixer = require('gulp-autoprefixer'),
		browserSync = require('browser-sync'),

		clean = require('gulp-clean'),
		compress = require('compression'),
		concat = require('gulp-concat'),
		gulpif = require('gulp-if'),
		gulpPug = require('gulp-pug'),
		gutil = require('gulp-util'),
		imagemin = require('gulp-imagemin'),
		minify = require('gulp-minify'),
		minifyCSS = require('gulp-minify-css'),
		notify = require('gulp-notify'),
		reload = browserSync.reload,
		pngcrush = require('imagemin-pngcrush'),
		prettify = require('gulp-prettify'),
		pug = require('pug'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		uglify = require('gulp-uglify'),
		strip = require('gulp-strip-comments'),
		eslint = require('gulp-eslint');

// Error handling
var onError = function(err) {
	// Console beeps on error
	gutil.beep();
};

// Sass Task
gulp.task('build-sass', function() {
	gulp.src(SASS_FILES)
		.pipe(sourcemaps.init())

		.pipe(sass({
			errLogToConsole: true,
			outputStyle: 'compressed',
			sourceComments: false
			// includePaths: ['sass'].concat(bourbon)
		}))
		.on("error", notify.onError({
			message: 'Error On line - <%= error.lineNumber %>, Error: <%= error.message %>'
		}))
		.pipe(autoprefixer({
			browsers: BROWSER_SUPPORT
		}))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(SASS_FED))
		.pipe(browserSync.stream({
			match: '/*.css'
		})
		);
});

// DEPLOY SASS
gulp.task('deploy-sass', function() {
	gulp.src(SASS_FILES)
		.pipe(sass({
			errLogToConsole: true,
			outputStyle: 'compressed',
			sourceComments: false
			// includePaths: ['sass'].concat(bourbon).concat('./node_modules/susy/sass')
		}))
		.pipe(minifyCSS({
			keepBreaks: false
		}))
		.pipe(autoprefixer({
			browsers: BROWSER_SUPPORT,
			cascade: false
		}))
		.pipe(gulp.dest(CSS_FED))
});

// Build Tasks
var buildTasks = ['build-sass'];

// watch tasks
gulp.task('pug-watch', ['templatesOnly'], reload);
gulp.task('modules-watch', ['jsModules'], reload);
gulp.task('vendor-watch', ['jsVendor'], reload);


// Default Task
gulp.task('build', buildTasks);
gulp.task('deploy', ['copyImages', 'copyFonts']);
gulp.task('default', ['build'], function() {

	browserSync({
		reloadDelay: 250,
		ignored: '*.pug',
		injectChanges: true,
		server: {
			baseDir: "FED/",
			middleware: [compress()]
		},
		//the first page to load
		startPath: "html/index.html"
	});

	gulp.watch(SASS_FILES, ['build-sass']);
	// gulp.watch(PUG_FILES, ['pug-watch']);
	// gulp.watch(JS_MODULES_FED + "/**/*.js", ['modules-watch']);
	// gulp.watch(JS_VENDOR_FED + "/**/*.js", ['vendor-watch']);
});
