const del = require('del');
const path = require('path');

const constants = require('./constants');

/**
 * Removes the output file
 * @returns {Promise} A promise for then the folder has been removed
 */
function clean() {
    const root_path = path.join(__dirname, '..', constants.ROOT);

    return del(root_path);
}

module.exports = clean;