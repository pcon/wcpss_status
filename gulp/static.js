const gulp = require('gulp');
const path = require('path');

const constants = require('./constants');

/**
 * Copies all the contents from the html directory
 * @returns {Object} A gulp task
 */
function static() {
    const src_path = path.join(__dirname, '..', 'html') + '/**';
    const dest_path = path.join(__dirname, '..', constants.ROOT);

    return gulp.src(src_path).pipe(gulp.dest(dest_path));
}

module.exports = static;