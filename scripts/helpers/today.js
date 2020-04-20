const lodash = require('lodash');
const moment = require('moment');

const constants = require('../constants');
const tracks = require('../utils/tracks');

const today = moment();

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
 * Gets today's schedule
 * @returns {Promise} A promise for today's schedule
 */
function getSchedule() {
    return new Promise(function (resolve, reject) {
        var promises = [];
        var date = today.format(constants.DATE_FORMAT);

        promises.push(tracks.getTraditionalStatus(constants.TRADITIONAL, date));
        promises.push(tracks.getTraditionalStatus(constants.MODIFIED, date));

        Promise.allSettled(promises)
            .then(combineSchedules)
            .then(function (schedule) {
                const today_schedule = {
                    [constants.TRADITIONAL]: lodash.get(schedule, `${constants.TRADITIONAL}.${date}`),
                    [constants.MODIFIED]: lodash.get(schedule, `${constants.MODIFIED}.${date}`)
                };
                resolve(today_schedule);
            })
            .catch(reject);
    });
}

module.exports = {
    getSchedule: getSchedule
};