import gulp from 'gulp';
import gulpFileInclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import pugs from 'gulp-pug';
import * as sass from 'sass';
import gsass from 'gulp-sass';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import ccso from 'gulp-csso';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import babel from 'gulp-babel';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify-es';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import fonter from 'gulp-fonter';
import buildSvgSprite from 'gulp-svg-sprite';
import replace from 'gulp-replace';
import { deleteAsync } from 'del';
import browserSync from 'browser-sync';

const srcPath = 'src/';
const distPath = 'dist/';

const path = {
    build: {
        html:   distPath,
        js:     distPath + "assets/js/",
        css:    distPath + "assets/css/",
        images: distPath + "assets/images/",
				svg:    distPath + "assets/images/svg/",
        fonts:  distPath + "assets/fonts/"
    },
    src: {
        html:   srcPath + "*.html",
				pug:    srcPath + "pug/*.pug",
        js:     srcPath + "assets/js/*.js",
				css:    srcPath + "assets/css/*.css",
        scss:   srcPath + "assets/scss/**/*.{scss, sass}",
        images: srcPath + "assets/images/**/*.{jpg,jpeg,png,gif,ico,webp}",
				svg:    srcPath + "assets/images/svg/*.svg",
        fonts:  srcPath + "assets/fonts/**/*.{woff,woff2,ttf,otf,eot,otc,ttc,svg}"
    },
    watch: {
        html:   srcPath + "**/*.html",
				pug:    srcPath + "pug/**/*.pug",
        js:     srcPath + "assets/js/**/*.js",
				css:    srcPath + "assets/css/**/*.css",
        scss:   srcPath + "assets/scss/**/*.{scss, sass}",
        images: srcPath + "assets/images/**/*.{jpg,jpeg,png,gif,ico,webp}",
				svg:    srcPath + "assets/images/svg/*.svg",
        fonts:  srcPath + "assets/fonts/**/*.{woff,woff2,ttf,otf,eot,otc,ttc,svg}"
    },
    clean: "./" + distPath
}

const server = () => {
	browserSync.init({
		server: {
				baseDir: "./" + distPath
		},
		browser: 'chrome',
		notify: false
	});
}

export const html = () => {
	return gulp.src([path.src.html, './src/html/**/*.html'], { base: srcPath })
		.pipe(gulpFileInclude())
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true,
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({ stream: true }));
}

export const pug = () => {
	return gulp.src(path.src.pug, { base: srcPath })
		.pipe(pugs({ pretty: true }))
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true,
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({ stream: true }));
}

export const css = () => {
	return gulp.src(path.src.css, { base: srcPath + "assets/css/", sourcemaps: true })
		.pipe(concat('style.css'))
		.pipe(groupCssMediaQueries())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ["last 2 versions"],
			cascade: true
		}))
		.pipe(gulp.dest(path.build.css, { sourcemaps: true }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(ccso())
		.pipe(gulp.dest(path.build.css, { sourcemaps: true }))
		.pipe(browserSync.reload({ stream: true }));
}

export const scss = () => {
	const sassCompiler = gsass(sass);
	return gulp.src(path.src.scss, { base: srcPath + "assets/scss/", sourcemaps: true })
		.pipe(sassCompiler())
		.pipe(groupCssMediaQueries())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ["last 2 versions"],
			cascade: true
		}))
		.pipe(gulp.dest(path.build.css, { sourcemaps: true }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(ccso())
		.pipe(gulp.dest(path.build.css, { sourcemaps: true }))
		.pipe(browserSync.reload({ stream: true }));
}

export const js = () => {
	const uglifyFunction = uglify.default;
	return gulp.src(path.src.js, { base: srcPath + 'assets/js/', sourcemaps: true })
		.pipe(babel())
		.pipe(webpack({
			mode: "development",
			entry: {
        app: './src/assets/js/app.js',
      },
      output: {
        filename: '[name].js',
      },
		}))
		.pipe(gulp.dest(path.build.js, { sourcemaps: true }))
		.pipe(uglifyFunction())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(path.build.js, { sourcemaps: true }))
		.pipe(browserSync.reload({ stream: true }));
}

export const images = () => {
	return gulp.src(path.src.images)
		.pipe(newer(path.build.images))
		.pipe(webp())
		.pipe(gulp.dest(path.build.images))
		.pipe(gulp.src(path.src.images))
		.pipe(newer(path.build.images))
		.pipe(imagemin({
			progressive: true,
			verbose: true
		}))
		.pipe(gulp.dest(path.build.images))
		.pipe(browserSync.reload({stream: true}));
}

export const svg = () => {
	return gulp.src(path.src.svg)
		.pipe(newer(path.build.svg))
		.pipe(gulp.dest(path.build.svg))
		
		.pipe(gulp.src(path.src.svg))
		.pipe(buildSvgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg"
				}
			}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(gulp.dest(path.build.svg))
		.pipe(browserSync.reload({ stream: true }));
}

export const fonts = () => {
	return gulp.src(path.src.fonts)
		.pipe(newer(path.build.fonts))
		.pipe(fonter({
			formats: ["ttf", "woff", "eot"]
		}))
		.pipe(gulp.dest(path.build.fonts))
		.pipe(browserSync.reload({ stream: true }));
}

export const clean = () => {
	return deleteAsync(path.clean);
}

export const watchFiles = () => {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.images], images);
	gulp.watch([path.watch.images], svg);
	gulp.watch([path.watch.fonts], fonts);
}

export const build = gulp.series(clean, gulp.parallel(html, scss, js, images, svg, fonts));
export const develop = gulp.parallel(build, watchFiles, server); 
export default develop;
