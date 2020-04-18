const path = require('path');

const DATA_ROOT = path.join(__dirname, '../../data');

/**
 * Gets the path to the file
 * @param {String} calendar_type The type of calendar to use
 * @param {Number} year The year to use
 * @param {String} type The type of file to find
 * @returns {String} The path to the file
 */
function getPath(calendar_type, year, type) {
    var year_str = '';
    var type_json = type ? type : '';

    if (year !== undefined) {
        year_str = year.toString();
    }

    if (
        type !== undefined &&
        !type.endsWith('.json')
    ) {
        type_json = `${type}.json`;
    }

    return path.join(DATA_ROOT, calendar_type, year_str, type_json);
}

module.exports = {
    getPath: getPath
};