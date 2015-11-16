var gulp = require('gulp'),
    babel = require('gulp-babel'),
    ts = require("gulp-typescript"),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require("merge2"),
    jade = require("gulp-jade"),
    browserSync = require("browser-sync").create(),
    superstatic = require("superstatic");

var tsProject = ts.createProject('tsconfig.json', {
  noExternalResolve: true
});

var babelOpts = {
  presets: ["es2015"],
  plugins: [
    "syntax-jsx",
    ["transform-react-jsx", { "pragma": "m" }]
  ],
};

var tsSource = ["src/**/*.ts", "src/**/*.tsx", "typings/**/*.d.ts", "typings-custom/**/*.d.ts", "typings.d.ts"];

gulp.task("copy-mithril", function() {
  return gulp.src("node_modules/mithril/mithril.min.js")
    .pipe(gulp.dest("publish/"));
});

gulp.task("compile-jade", function() {
  return gulp.src("src/**/*.jade")
    .pipe(jade({pretty:true}))
    .pipe(gulp.dest("publish/"));
});

gulp.task("compile-ts", function() {
  var tsResult = gulp.src(tsSource)
    .pipe(sourcemaps.init())
      .pipe(ts(tsProject)).js
      .pipe(babel(babelOpts))
    .pipe(sourcemaps.write());
    
    return tsResult.pipe(gulp.dest("publish/"))
});

gulp.task("default", ["compile-ts", "compile-jade", "copy-mithril"]);

// gulp.task("compile-ts-watch", ["compile-ts"], browserSync.reload);
// gulp.task("compile-jade-watch", ["compile-jade"], browserSync.reload);

gulp.task("serve", ["default"], function() {
  browserSync.init({
    port: 8080,
    files: ["publish/**/*.html", "publish/**/*.js", "publish/**/*.css"],
    injectChanges: true,
    logFileChanges: false,
    logLevel: 'silent',
    logPrefix: 'zshazz-mithril-example',
    notify: true,
    reloadDelay: 500,
    server: {
      baseDir: './publish',
      middleware: superstatic({ cwd: "./publish" })
    }
  });
  
  gulp.watch(tsSource, ["compile-ts"]);
  gulp.watch(["src/**/*.jade"], ["compile-jade"]);
});
