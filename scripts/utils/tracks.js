const moment = require('moment-timezone');
const lodash = require('lodash');

const constants = require('../constants');
const utils_date = require('./date');
const utils_files = require('./files');
const utils_path = require('./path');

moment.tz.setDefault(constants.TIMEZONE);

/**
 * Is the class in session
 * @param {String} date The date
 * @param {String[]} exceptions An array of exception days
 * @param {String[]} makeup_days An array of makeup days
 * @returns {Boolean} If class is in session
 */
function inSession(date, exceptions, makeup_days) {
    var in_session = !lodash.includes(exceptions, date);

    if (utils_date.isWeekendDate(date)) {
        in_session = false;
    }

    if (lodash.includes(makeup_days, date)) {
        in_session = true;
    }

    return in_session;
}

/**
 * Gets the year round status
 * @param {String} date The date string to get the status for
 * @returns {Promise} A promise for when the status has been generated
 */
function getYearRoundStatus(date) {
    return new Promise(function (resolve, reject) {
        var promises = [];
        const m = moment(date);
        const year = m.year();
        const calendar_type = constants.YEAR_ROUND;

        constants.CALENDAR_TYPES[calendar_type].exceptions.forEach(function (exception) {
            const path = utils_path.getPath(calendar_type, year, exception);
            promises.push(utils_files.readJSONFile(path));
        });

        const cancellations_path = utils_path.getPath('', '', constants.CANCELLATIONS);
        promises.push(utils_files.readJSONFile(cancellations_path));

        Promise.allSettled(promises)
            .then(function (results) {
                var errors = [];
                var exceptions = [];
                var tracks = {};

                constants.TRACKS.forEach(function (track) {
                    tracks[track] = [];
                });

                results.forEach(function (result) {
                    if (result.status !== 'fulfilled') {
                        errors.push(result.reason);
                        return;
                    }

                    if (lodash.isArray(result.value)) {
                        exceptions = lodash.union(exceptions, result.value);
                    } else {
                        constants.TRACKS.forEach(function (track) {
                            tracks[track] = lodash.union(tracks[track], result.value[track]);
                        });
                    }
                });

                if (!lodash.isEmpty(errors)) {
                    reject(errors);
                } else {
                    const makeup_path = utils_path.getPath(calendar_type, year, constants.MAKEUP);
                    utils_files.readJSONFile(makeup_path)
                        .then(function (makeup_days) {
                            var tracks_in_session = {};

                            constants.TRACKS.forEach(function (track) {
                                tracks_in_session[track] = inSession(date, lodash.union(exceptions, tracks[track]), makeup_days[track]);
                            });

                            resolve({
                                [calendar_type]: {
                                    [date]: tracks_in_session
                                }
                            });
                        });
                }
            });
    });
}

/**
 * Gets if the traditional schools are in session
 * @param {String} calendar_type The calendar type
 * @param {String} date The date string to get the status for
 * @returns {Promise} A promise for when the status has been generated
 */
function getTraditionalStatus(calendar_type, date) {
    return new Promise(function (resolve, reject) {
        var promises = [];
        const m = moment(date);
        const year = m.year();

        constants.CALENDAR_TYPES[calendar_type].exceptions.forEach(function (exception) {
            const path = utils_path.getPath(calendar_type, year, exception);
            promises.push(utils_files.readJSONFile(path));
        });

        const cancellations_path = utils_path.getPath('', '', constants.CANCELLATIONS);
        promises.push(utils_files.readJSONFile(cancellations_path));

        Promise.allSettled(promises)
            .then(function (results) {
                var errors = [];
                var exceptions = [];

                results.forEach(function (result) {
                    if (result.status !== 'fulfilled') {
                        errors.push(result.reason);
                        return;
                    }

                    exceptions = lodash.union(exceptions, result.value);
                });

                if (!lodash.isEmpty(errors)) {
                    reject(errors);
                } else {
                    const makeup_path = utils_path.getPath(calendar_type, year, constants.MAKEUP);
                    utils_files.readJSONFile(makeup_path)
                        .then(function (makeup_days) {
                            resolve({
                                [calendar_type]: {
                                    [date]: inSession(date, exceptions, makeup_days)
                                }
                            });
                        })
                        .catch(reject);
                }
            });
    });
}

/**
 * Gets the delay for a given day
 * @param {String} date The date
 * @returns {Promise} A promise for when the delay has been returned
 */
function getDelay(date) {
    return new Promise(function (resolve, reject) {
        const file_path = utils_path.getPath('', '', constants.DELAYS);

        utils_files.readJSONFile(file_path)
            .then(function (delays) {
                var delay = 0;

                if (lodash.has(delays, date)) {
                    delay = lodash.get(delays, date);
                }

                resolve({
                    [constants.DELAYS]: delay
                });
            })
            .catch(reject);
    });
}

module.exports = {
    getDelay: getDelay,
    getTraditionalStatus: getTraditionalStatus,
    getYearRoundStatus: getYearRoundStatus
};