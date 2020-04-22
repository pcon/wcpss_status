const gulp = require('gulp');

const clean = require('./gulp/clean');
const static = require('./gulp/static');
const today = require('./gulp/today');
const tomorrow = require('./gulp/tomorrow');
const thisweek = require('./gulp/thisweek');
const nextweek = require('./gulp/nextweek');

const parallel_jobs = [
    static,
    today,
    tomorrow,
    thisweek,
    nextweek
];

gulp.task('build', gulp.parallel(parallel_jobs));
const build = gulp.task('build');

exports.default = gulp.series(clean, build);