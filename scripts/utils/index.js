const fs = require('fs');
const jsonfile = require('jsonfile');
const lodash = require('lodash');

const constants = require('../constants');
const utils_generic = require('./generic');
const utils_path = require('./path');
const utils_date = require('./date');

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

/**
 * Check an array of dates to make sure they are valid and not on the weekend
 * @param {String[]} data An array of dates to check
 * @param {String} info The information about where the dates came from
 * @param {Function} resolve The resolve function
 * @param {Function} reject The reject function
 * @returns {undefined}
 */
function checkDates(data, info, resolve, reject) {
    const invalid_dates = utils_date.getInvalidDates(data);
    const weekend_dates = utils_date.getWeekendDates(data);

    if (!lodash.isEmpty(invalid_dates)) {
        reject(new Error(`${info} has invalid dates ${invalid_dates}`));
    } else if (!lodash.isEmpty(weekend_dates)) {
        reject(new Error(`${info} has dates on the weekend ${weekend_dates}`));
    } else {
        resolve();
    }
}

/**
 * Checks to see if all the dates in the file are valid
 * This includes not only a format check but that no dates are on weekends
 * @param {String} path The path to the file
 * @returns {Promise} A promise that all the dates in the file are correct
 */
function checkDatesFile(path) {
    return new Promise(function (resolve, reject) {
        jsonfile.readFile(path, function (err, data) {
            if (err) {
                reject(err);
            } else if (!lodash.isArray(data)) {
                reject(new Error(`${path} provided non array data`));
            } else {
                checkDates(data, path, resolve, reject);
            }
        });
    });
}

/**
 * Checks both modified and traditional calendars
 * @param {String} calendar_type The calendar type
 * @param {Number} year The year
 * @returns {Promise} A promise for when the calendar has been checked
 */
function checkTraditionalYear(calendar_type, year) {
    return new Promise(function (resolve, reject) {
        var promises = [];
        const selector = `${calendar_type}.${constants.EXCEPTIONS}`;

        lodash.forEach(lodash.get(constants.CALENDAR_TYPES, selector), function (type) {
            const path = utils_path.getPath(calendar_type, year, type);
            promises.push(checkDatesFile(path));
        });

        Promise.allSettled(promises)
            .then(function (results) {
                var errors = [];

                results.forEach(function (result) {
                    if (result.status === 'rejected') {
                        errors.push(result.reason);
                    }
                });

                if (!lodash.isEmpty(errors)) {
                    reject(`${calendar_type}_${year}: ${errors}`);
                } else {
                    resolve();
                }
            });
    });
}

/**
 * Checks to make sure all the dates for tracks are valid
 * @param {String} path The path to the track-out file
 * @returns {Promise} A promise for when the track-out file has been checked
 */
function checkTracks(path) {
    return new Promise(function (resolve, reject) {
        jsonfile.readFile(path, function (err, data) {
            if (err) {
                reject(err);
            } else if (!lodash.isObject(data)) {
                reject(new Error(`${path} provided non object data`));
            } else {
                var errors = [];

                constants.TRACKS.forEach(function (track) {
                    if (!lodash.has(data, track)) {
                        errors.push(`Unable to find ${track} in ${path}`);
                        return;
                    }

                    checkDates(lodash.get(data, track), `${path} - ${track}`, function () {}, function (check_errors) {
                        errors.push(check_errors);
                    });
                });

                if (!lodash.isEmpty(errors)) {
                    reject(errors);
                } else {
                    resolve();
                }
            }
        });
    });
}

/**
 * Checks the year-round calendar
 * @param {Number} year The year
 * @returns {Promise} A promise for when the calendar has been checked
 */
function checkYearRoundYear(year) {
    return new Promise(function (resolve, reject) {
        var promises = [];
        const selector = `${constants.YEAR_ROUND}.${constants.EXCEPTIONS}`;

        lodash.forEach(lodash.get(constants.CALENDAR_TYPES, selector), function (type) {
            const path = utils_path.getPath(constants.YEAR_ROUND, year, type);

            if (type === constants.TRACK_OUT) {
                promises.push(checkTracks(path));
            } else {
                promises.push(checkDatesFile(path));
            }
        });

        Promise.allSettled(promises)
            .then(function (results) {
                var errors = [];

                results.forEach(function (result) {
                    if (result.status === 'rejected') {
                        errors.push(result.reason);
                    }
                });

                if (!lodash.isEmpty(errors)) {
                    reject(`${constants.YEAR_ROUND}_${year}: ${errors}`);
                } else {
                    resolve();
                }
            });
    });
}

/**
 * Checks all the files associated with a given calendar type and year
 * @param {String} calendar_type The calendar type name
 * @param {Number} year The calendar year
 * @returns {Promise} A promise for when the calendar has been checked
 */
function checkYear(calendar_type, year) {
    var promise;

    switch (calendar_type) {
    case constants.MODIFIED:
    case constants.TRADITIONAL:
        promise = checkTraditionalYear(calendar_type, year);
        break;
    case constants.YEAR_ROUND:
        promise = checkYearRoundYear(year);
        break;
    default:
        promise = utils_generic.promiseError(`Unknown calendar type '${calendar_type}'`);
    }

    return promise;
}

/**
 * Checks to make sure all the data for the calendar is correct
 * @param {String} calendar_type The calendar type name
 * @returns {Promise} A promise for when the calendar type has been checked
 */
function checkCalendars(calendar_type) {
    return new Promise(function (resolve, reject) {
        listYears(calendar_type)
            .then(function (years) {
                var promises = [];
                var errors = [];

                years.forEach(function (year) {
                    promises.push(checkYear(calendar_type, year));
                });

                Promise.allSettled(promises)
                    .then(function (results) {
                        results.forEach(function (result) {
                            if (result.status === 'rejected') {
                                errors.push(result.reason);
                            }
                        });

                        if (errors.length > 0) {
                            reject(errors);
                        } else {
                            resolve();
                        }
                    });
            })
            .catch(reject);
    });
}

module.exports = {
    checkCalendars: checkCalendars,
    date: utils_date,
    generic: utils_generic,
    path: utils_path,
    listYears: listYears
};