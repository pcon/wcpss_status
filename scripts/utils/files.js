const fs = require('fs');

const utils_generic = require('./generic');
const utils_path = require('./path');

/**
 * Gets a list of years available for a calendar type
 * @param {String} calendar_type The calendar type to check
 * @returns {Promise} A promise for an array of years that the calendar type knows about
 */
function listYears(calendar_type) {
    const base_path = utils_path.getPath(calendar_type);
    const opts = {
        withFileTypes: true
    };

    return new Promise(function (resolve, reject) {
        fs.readdir(base_path, opts, function (err, files) {
            if (err) {
                reject(err);
            } else {
                const folder_list = files
                    .filter(utils_generic.isDirectory)
                    .map(utils_generic.getFileName)
                    .map(utils_generic.toNumber);

                resolve(folder_list);
            }
        });
    });
}

module.exports = {
    listYears: listYears
};