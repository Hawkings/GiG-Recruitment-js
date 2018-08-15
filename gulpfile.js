"use strict";
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");
var watchify = require("watchify");
var babel = require("babelify");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify-es").default;

function compile(watch) {
  // browserify will look for our entry files
  var bundler = watchify(browserify(
    { entries: ["./src/index.js"], debug: true, extensions: [".js"] }
  ).transform(babel));
  var startTime;

  function rebundle() {
    startTime = new Date().getTime();
    bundler.bundle()
    .on("error", function (err) {
      console.error(err); 
      this.emit("end"); 
      })
    .pipe(source("index.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify()) // uglify will do the minified version of our based scripts.
    .pipe(rename("index.min.js")) // rename the original file for minify version
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./build/js"))
    .on("end", () => {
      var timeDelta = new Date().getTime() - startTime;
      console.log("done " + timeDelta/1000 + "s");
    });
  }

  if (watch) {
    bundler.on("update", function() {
    console.log("-> bundling...");
    rebundle();
    });
  }

  rebundle();
}

function watch() {
return compile(true);
}

gulp.task("watch", function () { return watch(); });

// set the default task to watch so that the gulp process will monitor
// for any change and rebuild the javascript files.
gulp.task("default", ["watch"]);