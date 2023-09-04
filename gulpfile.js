const gulp = require("gulp");
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const sass = require('gulp-sass')(require('sass'));
const uglify = require("gulp-uglify")
const buffer = require("vinyl-buffer")
const autoPrefixer = require("gulp-autoprefixer")
const cleanCss = require("gulp-clean-css")

const dist = "C:/OSPanel/domains/verstka/admin";
const distProd = "./build/";

gulp.task("copy-html", () => {
    return gulp.src("./app/index.html")
        .pipe(gulp.dest(dist));
});

gulp.task("copy-api", () => {
    return gulp.src("./app/api/**/*.*")
        .pipe(gulp.dest(dist + "/api"));
});

gulp.task("copy-assets", () => {
    return gulp.src("./app/assets/**/*.*")
        .pipe(gulp.dest(dist + "/assets"));
});

gulp.task("build-js", () => {
    return browserify('./app/src/main.js', {debug: true})
                .transform("babelify", {presets: ["@babel/preset-env"], sourceMap: true})
                .bundle()
                .pipe(source('bundle.js'))
                .pipe(gulp.dest(dist));
});

gulp.task("build-sass",() => {
    return gulp.src('./app/sass/style.sass')
                .pipe(sass())
                .pipe(gulp.dest(dist));
});

gulp.task("watch", () => {
    gulp.watch("./app/index.html", gulp.parallel('copy-html'))
    gulp.watch("./app/api/**/*.*", gulp.parallel('copy-api'))
    gulp.watch("./app/assets/**/*.*", gulp.parallel('copy-assets'))
    gulp.watch("./app/src/**/*.js", gulp.parallel('build-js'))
    gulp.watch("./app/sass/**/*.sass", gulp.parallel('build-sass'))
})

gulp.task("build", gulp.parallel('copy-html', 'copy-api', 'copy-assets', 'build-js', 'build-sass'));

gulp.task("build-prod", () => {
    gulp.src("./app/index.html")
        .pipe(gulp.dest(distProd));
    gulp.src("./app/api/**/*.*")
        .pipe(gulp.dest(distProd + "/api"));
    gulp.src("./app/api/**/.*")
        .pipe(gulp.dest(distProd + "/api"));
    gulp.src("./app/assets/**/*.*")
        .pipe(gulp.dest(distProd + "/assets"));
    browserify('./app/src/main.js', {debug: false})
        .transform("babelify", {presets: ["@babel/preset-env"], sourceMap: false})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(distProd));
    gulp.src('./app/sass/style.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer())
        .pipe(cleanCss())
        .pipe(gulp.dest(distProd));
})

gulp.task("default", gulp.parallel("watch", "build"));