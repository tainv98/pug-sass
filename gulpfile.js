const { src, dest, parallel, watch, series } = require("gulp"),
    concat = require("gulp-concat"),
    sass = require("gulp-sass"),
    pug = require("gulp-pug"),
    browserSync = require("browser-sync").create();

const FilesPath = {
    sassFiles: "src/scss/*.scss",
    htmlFiles: "src/pug/pages/*.pug",
    jsFiles: "src/js/*.js",
};

function sassTask() {
    return src(FilesPath.sassFiles)
        .pipe(sass())
        .pipe(concat("styles.css"))
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
}

function htmlTask() {
    return src(FilesPath.htmlFiles)
        .pipe(pug({ pretty: true }))
        .pipe(dest("dist"))
        .pipe(browserSync.stream());
}

function jsTask() {
    return src(FilesPath.jsFiles)
        .pipe(dest("dist/js"))
        .pipe(browserSync.stream());
}

function assetsTask() {
    return src("assets/**/*").pipe(dest("dist/assets"));
}

function serve() {
    browserSync.init({ server: { baseDir: "./dist" } });
    watch("src/scss/**/*.scss", sassTask);
    watch("src/pug/**/*.pug", htmlTask);
    watch(FilesPath.jsFiles, jsTask);
}

exports.sass = sassTask;
exports.html = htmlTask;
exports.js = jsTask;
exports.assets = assetsTask;
exports.default = series(parallel(htmlTask, sassTask, jsTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, jsTask, assetsTask));