const gulp = require('gulp');

const today = require('./gulp/today');

exports.default = gulp.parallel(today);