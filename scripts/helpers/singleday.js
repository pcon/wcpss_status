const lodash = require('lodash');

const constants = require('../constants');
const tracks = require('../utils/tracks');

/**
 * Combines all the schedules into one object
 * @param {Object} results The promise results
 * @returns {Promise} A promise for when all the schedules have been combined
 */
function combineSchedules(results) {
    return new Promise(function (resolve, reject) {
        var errors = [];
        var schedule = {};

        results.forEach(function (result) {
            if (result.status !== 'fulfilled') {
                errors.push(result.status);
                return;
            }

            schedule = lodash.assign(schedule, result.value);
        });

        if (!lodash.isEmpty(errors)) {
            reject(errors);
        } else {
            resolve(schedule);
        }
    });
}

/**
 * Gets a days schedule
 * @param {String} date The date
 * @returns {Promise} A promise for today's schedule
 */
function getSchedule(date) {
    return new Promise(function (resolve, reject) {
        var promises = [];

        promises.push(tracks.getTraditionalStatus(constants.TRADITIONAL, date));
        promises.push(tracks.getTraditionalStatus(constants.MODIFIED, date));
        promises.push(tracks.getYearRoundStatus(date));

        Promise.allSettled(promises)
            .then(combineSchedules)
            .then(function (schedule) {
                const today_schedule = {
                    [constants.DATE]: date,
                    [constants.TRADITIONAL]: lodash.get(schedule, `${constants.TRADITIONAL}.${date}`),
                    [constants.MODIFIED]: lodash.get(schedule, `${constants.MODIFIED}.${date}`),
                    [constants.YEAR_ROUND]: lodash.get(schedule, `${constants.YEAR_ROUND}.${date}`)
                };
                resolve(today_schedule);
            })
            .catch(reject);
    });
}

module.exports = {
    getSchedule: getSchedule
};