const path = require('path');

const constants = require('./constants');
const files = require('../scripts/utils/files');

const DIST_ROOT = path.join(__dirname, '..', constants.ROOT);

/**
 * Writes data to the ROOT path
 * @param {Object} data The data to write
 * @param {String} filename The filename to write
 * @param {String} directory The directory to write to
 * @returns {Promise} A promise for when the file has been written
 */
function writeData(data, filename, directory) {
    return new Promise(function (resolve, reject) {
        const file = path.join(DIST_ROOT, directory, filename);
        const root_dir = path.dirname(file);

        files.makeDirectory(root_dir)
            .then(function () {
                files.writeJSONFile(file, data)
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}

module.exports = {
    writeData: writeData
};