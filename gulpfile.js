var gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  glob = require('glob'),
  es = require('event-stream'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  babelify = require('babelify'),
  path = require('path'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  size = require('gulp-filesize');

var isdev = process.env.NODE_ENV === 'development';

var reactPath = path.join(process.cwd(), 'src');
var buildDir = 'public/assets/react';

function handleErrors() {
  console.log(arguments);
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}


// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file) {
  var props = {
    // Required watchify args
    _options: {cache: {}, packageCache: {}, fullPaths: true},
    // Browserify Options
    entries: [reactPath + '/' + file],
    debug: false,
    standalone: file.replace(/\//g, '.').replace('.jsx', '')
  };

  // var bundler = watch ? watchify(browserify(props)) : browserify(props);
  var bundler = browserify(props);

  function bundle() {
    return bundler
      .transform(babelify, {presets: ['es2015', 'react']})
      .external(['react', 'react-dom'])
      .ignore('react-dom/server')
      .bundle()
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(rename({extname: '.js'}))
      .pipe(gulp.dest(buildDir));
  }

  return bundle();
}

gulp.task('react', ['react:common', 'react:uglify'], function(done) {
  glob('component/**/*.*', { cwd: reactPath }, function(err, files) {
    if(err) {
      return done(err);
    }

    var tasks = files.map(function(entry) {
      return buildScript(entry);
    });
    es.merge(tasks).on('end', done);
  });
});

gulp.task('react:common', function() {
  return browserify({
    entries: [reactPath + '/common.js'],
    debug: false
  })
    .require('react')
    .require('react-dom')
    .bundle()
    .pipe(source('common.js'))
    .pipe(gulp.dest(buildDir));
});

gulp.task('react:uglify', ['react:common'], function() {
  if(isdev) {
    return;
  }

  return gulp.src(buildDir + '/**')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(buildDir))
    .pipe(size());
});

gulp.task('watch:react', function () {
  if(!isdev) {
    return;
  }

  gulp.watch([reactPath + '/**'], ['react', 'react:common', 'react:uglify']);
});


gulp.task('default', [
  'react',
  'react:common',
  'react:uglify',
  'watch:react'
]);