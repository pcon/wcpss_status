const lodash = require('lodash');

const constants = require('../constants');
const utils_date = require('./date');
const utils_files = require('./files');
const utils_generic = require('./generic');
const utils_path = require('./path');

/**
 * Check an array of dates to make sure they are valid and not on the weekend
 * @param {String[]} data An array of dates to check
 * @param {Number} year The year
 * @param {String} info The information about where the dates came from
 * @param {Function} resolve The resolve function
 * @param {Function} reject The reject function
 * @param {Boolean} include_weekend If the weekend should be included as invalid
 * @returns {undefined}
 */
function checkDates(data, year, info, resolve, reject, include_weekend=true) {
    const invalid_dates = utils_date.getInvalidDates(data, year);
    const weekend_dates = utils_date.getWeekendDates(data);

    if (!lodash.isEmpty(invalid_dates)) {
        reject(new Error(`${info} has invalid dates ${invalid_dates}`));
    } else if (include_weekend && !lodash.isEmpty(weekend_dates)) {
        reject(new Error(`${info} has dates on the weekend ${weekend_dates}`));
    } else {
        resolve();
    }
}

/**
 * Checks a file to make sure that an array exists and the data is correct
 * @param {String} path The file path
 * @param {Number} year The year
 * @param {Boolean} include_weekend If weekend should be considered an error condition
 * @returns {Promise} A promise for when the file has been checked
 */
function checkArrayFile(path, year, include_weekend) {
    return new Promise(function (resolve, reject) {
        utils_files.readJSONFile(path)
            .then(function (data) {
                if (!lodash.isArray(data)) {
                    reject(new Error(`${path} provided non array data`));
                } else {
                    checkDates(data, year, path, resolve, reject, include_weekend);
                }
            })
            .catch(reject);
    });
}

/**
 *
 * @param {String} path The path to check
 * @returns {Promise} A promise for when the object file has been handled
 */
function checkObjectFile(path) {
    return new Promise(function (resolve, reject) {
        utils_files.readJSONFile(path)
            .then(function (data) {
                if (!lodash.isObject(data)) {
                    reject(`${path} provided non object data`);
                } else {
                    resolve(data);
                }
            })
            .catch(reject);
    });
}

/**
 * Checks to see if all the dates in the file are valid
 * This includes not only a format check but that no dates are on weekends
 * @param {String} path The path to the file
 * @param {Number} year The year
 * @returns {Promise} A promise that all the dates in the file are correct
 */
function checkDatesFile(path, year) {
    return checkArrayFile(path, year, false);
}

/**
 * Checks that the makeup days are formatted correctly
 * @param {String} calendar_type The calendar type
 * @param {Number} year The year
 * @returns {Promise} A promise for when the makeup days have been checked
 */
function checkTraditionalMakeupDays(calendar_type, year) {
    const path = utils_path.getPath(calendar_type, year, constants.MAKEUP);
    return checkArrayFile(path, year, true);
}

/**
 * Checks the special days are formatted correctly
 * @param {String} calendar_type The calendar type
 * @param {Number} year The year
 * @returns {Promise} A promise for when the special days have been checked
 */
function checkTraditionalSpecialDays(calendar_type, year) {
    return new Promise(function (resolve, reject) {
        const path = utils_path.getPath(calendar_type, year, constants.SPECIALS);

        checkObjectFile(path)
            .then(function (data) {
                var errors = [];

                lodash.forEach(data, function (value, key) {
                    if (utils_date.isInvalidDate(key)) {
                        errors.push(`${path} - Key ${key} is not a valid date`);
                    } else if (utils_date.isNotSameYear(year, key)) {
                        errors.push(`${path} - Key ${key} is not the same year`);
                    } else if (!lodash.isArray(value) && !lodash.isString(value)) {
                        errors.push(`${path} - Value for ${key} is not a string or an array`);
                    } else if (lodash.isString(value) && !lodash.includes(constants.SPECIAL_TYPES, value)) {
                        errors.push(`${path} - Value for ${key} "${value}" is not a valid special type`);
                    } else if (lodash.isArray(value)) {
                        lodash.forEach(value, function (special) {
                            if (!lodash.includes(constants.SPECIAL_TYPES, special)) {
                                errors.push(`${path} - Value in ${key} array ${special} is not a valid special type`);
                            }
                        });
                    }
                });

                if (!lodash.isEmpty(errors)) {
                    reject(errors);
                } else {
                    resolve();
                }
            })
            .catch(reject);
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
            promises.push(checkDatesFile(path, year));
        });

        promises.push(checkTraditionalMakeupDays(calendar_type, year));
        promises.push(checkTraditionalSpecialDays(calendar_type, year));

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
 * @param {Number} year The year
 * @param {Boolean} include_weekend If the weekend should be included as an error
 * @returns {Promise} A promise for when the track-out file has been checked
 */
function checkTracks(path, year, include_weekend=true) {
    return new Promise(function (resolve, reject) {
        checkObjectFile(path)
            .then(function (data) {
                var errors = [];

                constants.TRACKS.forEach(function (track) {
                    const track_data = lodash.get(data, track);

                    if (!track_data) {
                        errors.push(`Unable to find ${track} in ${path}`);
                        return;
                    }

                    if (!lodash.isArray(track_data)) {
                        errors.push(`${track} in ${path} is not an array`);
                        return;
                    }

                    checkDates(track_data, year, `${path} - ${track}`, function () {}, function (check_errors) {
                        errors.push(check_errors);
                    }, include_weekend);
                });

                if (!lodash.isEmpty(errors)) {
                    reject(errors);
                } else {
                    resolve();
                }
            })
            .catch(reject);
    });
}

/**
 * Checks that the makeup days are formatted correctly
 * @param {Number} year The year
 * @returns {Promise} A promise for when the makeup days have been checked
 */
function checkYearRoundMakeupDays(year) {
    return new Promise(function (resolve, reject) {
        const path = utils_path.getPath(constants.YEAR_ROUND, year, constants.MAKEUP);

        checkTracks(path, year, false)
            .then(resolve)
            .catch(reject);
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
                promises.push(checkTracks(path, year));
            } else {
                promises.push(checkDatesFile(path, year));
            }
        });

        promises.push(checkYearRoundMakeupDays(year));

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
 * Checks that the delays file is properly formatted
 * @returns {Promise} A promise for when the check has completed
 */
function checkDelaysFile() {
    return new Promise(function (resolve, reject) {
        const path = utils_path.getPath('', '', constants.DELAYS);

        checkObjectFile(path)
            .then(function (data) {
                var errors = [];

                lodash.forEach(data, function (value, key) {
                    if (utils_date.isInvalidDate(key)) {
                        errors.push(`${path} - Key ${key} is not a valid date`);
                    } else if (utils_date.isWeekendDate(key)) {
                        errors.push(`${path} - Key ${key} is on a weekend`);
                    } else if (typeof value !== 'number') {
                        errors.push(`${path} - Value for ${key} "${value}" is not a number`);
                    }
                });

                if (!lodash.isEmpty(errors)) {
                    reject(errors);
                } else {
                    resolve();
                }
            })
            .catch(reject);
    });
}

/**
 * Checks the exception files to make sure they're properly formatted
 * @returns {Promise} A promise for when the global exception files are checked
 */
function checkExceptionFiles() {
    return new Promise(function (resolve, reject) {
        var promises = [];

        constants.GLOBAL_EXCEPTIONS.forEach(function (exception) {
            const path = utils_path.getPath('', '', exception);

            if (exception !== constants.DELAYS) {
                promises.push(checkArrayFile(path, undefined, true));
            }
        });

        promises.push(checkDelaysFile());

        Promise.allSettled(promises)
            .then(function (results) {
                var errors = [];

                results.forEach(function (result) {
                    if (result.status === 'rejected') {
                        errors.push(result.reason);
                    }
                });

                if (!lodash.isEmpty(errors)) {
                    reject(errors);
                } else {
                    resolve();
                }
            });
    });
}

/**
 * Checks to make sure all the data for the calendar is correct
 * @param {String} calendar_type The calendar type name
 * @returns {Promise} A promise for when the calendar type has been checked
 */
function checkCalendars(calendar_type) {
    return new Promise(function (resolve, reject) {
        utils_files.listYears(calendar_type)
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
    checkExceptionFiles: checkExceptionFiles,
    checkCalendars: checkCalendars
};