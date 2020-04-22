const lodash = require('lodash');
const moment = require('moment');

const constants = require('../constants');
const single_day = require('./singleday');

const today = moment();

/**
 * Gets this weeks's schedule
 * @returns {Promise} A promise for this week's schedule
 */
function getSchedule() {
    return new Promise(function (resolve, reject) {
        const start = moment(today.startOf('isoWeek'));
        const end = moment(today.endOf('isoWeek'));

        var current_day = moment(start);

        var promises = [];

        do {
            const date = current_day.format(constants.DATE_FORMAT);
            promises.push(single_day.getSchedule(date));
            current_day.add(1, 'day');
        } while (current_day.isSameOrBefore(end));

        Promise.allSettled(promises)
            .then(function (results) {
                const date_map = {};
                const errors = [];

                results.forEach(function (result) {
                    if (result.status !== 'fulfilled') {
                        errors.push(result.message);
                    } else {
                        date_map[result.value.date] = result.value;
                    }
                });

                if (!lodash.isEmpty(errors)) {
                    reject(errors);
                } else {
                    const schedule = [];

                    current_day = moment(start);

                    do {
                        const date = current_day.format(constants.DATE_FORMAT);
                        schedule.push(date_map[date]);
                        current_day.add(1, 'day');
                    } while (current_day.isSameOrBefore(end));

                    resolve(schedule);
                }
            })
            .catch(reject);
    });
}

module.exports = {
    getSchedule: getSchedule
};