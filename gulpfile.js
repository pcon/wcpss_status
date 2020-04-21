const gulp = require('gulp');

const clean = require('./gulp/clean');
const static = require('./gulp/static');
const today = require('./gulp/today');
const tomorrow = require('./gulp/tomorrow');

gulp.task('build', gulp.parallel(static, today, tomorrow));
const build = gulp.task('build');

exports.default = gulp.series(clean, build);