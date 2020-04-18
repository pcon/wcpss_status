/**
 * Gets if a file is a directory
 * @param {Object} fstat A file descriptor
 * @returns {Boolean} If the file is a directory
 */
function isDirectory(fstat) {
    return fstat.isDirectory();
}

/**
 * Gets the file name
 * @param {Object} fstat A file descriptor
 * @returns {String} The file name
 */
function getFileName(fstat) {
    return fstat.name;
}

/**
 * Converts the object to string
 * @param {String} obj The object
 * @returns {String} The string version
 */
function toNumber(obj) {
    return parseInt(obj);
}

/**
 * Errors out a promise with a given message
 * @param {String} error_message The error message
 * @returns {Promise} An erroring promise
 */
function promiseError(error_message) {
    return new Promise(function (resolve, reject) {
        reject(error_message);
    });
}

module.exports = {
    isDirectory: isDirectory,
    getFileName: getFileName,
    promiseError: promiseError,
    toNumber: toNumber
};