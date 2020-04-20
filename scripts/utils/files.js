const fs = require('fs');
const jsonfile = require('jsonfile');

const utils_generic = require('./generic');
const utils_path = require('./path');

/**
 * Makes the directory
 * @param {String} dir The directory path
 * @returns {Promise} A promise for when the directory is made
 */
function makeDirectory(dir) {
    return new Promise(function (resolve, reject) {
        const opts = {
            recursive: true
        };

        fs.mkdir(dir, opts, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Reads a json file
 * @param {String} path The path
 * @returns {Promise} A promise for the files data
 */
function readJSONFile(path) {
    return new Promise(function (resolve, reject) {
        jsonfile.readFile(path, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Writes a json file
 * @param {String} path The path
 * @param {Object} data The data
 * @returns {Promise} A promise for when the file has been written
 */
function writeJSONFile(path, data) {
    return new Promise(function (resolve, reject) {
        jsonfile.writeFile(path, data, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

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
    listYears: listYears,
    makeDirectory: makeDirectory,
    readJSONFile: readJSONFile,
    writeJSONFile: writeJSONFile
};