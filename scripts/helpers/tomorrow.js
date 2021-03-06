const moment = require('moment-timezone');

const constants = require('../constants');
const single_day = require('./singleday');

moment.tz.setDefault(constants.TIMEZONE);
const tomorrow = moment().add(1, 'day');

/**
 * Gets today's schedule
 * @returns {Promise} A promise for today's schedule
 */
function getSchedule() {
    var date = tomorrow.format(constants.DATE_FORMAT);

    return single_day.getSchedule(date);
}

module.exports = {
    getSchedule: getSchedule
};