const moment = require('moment');

const constants = require('../constants');
const single_day = require('./singleday');

const today = moment();

/**
 * Gets today's schedule
 * @returns {Promise} A promise for today's schedule
 */
function getSchedule() {
    var date = today.format(constants.DATE_FORMAT);

    return single_day.getSchedule(date);
}

module.exports = {
    getSchedule: getSchedule
};