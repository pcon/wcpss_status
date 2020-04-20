const moment = require('moment');
const lodash = require('lodash');

const constants = require('../constants');
const utils_date = require('./date');
const utils_files = require('./files');
const utils_path = require('./path');

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
                            var in_session = !lodash.includes(exceptions, date);

                            if (utils_date.isWeekendDate(date)) {
                                in_session = false;
                            }

                            if (lodash.includes(makeup_days, date)) {
                                in_session = true;
                            }

                            resolve({
                                [calendar_type]: {
                                    [date]: in_session
                                }
                            });
                        })
                        .catch(reject);
                }
            });
    });
}

module.exports = {
    getTraditionalStatus: getTraditionalStatus
};