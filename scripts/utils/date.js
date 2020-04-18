const moment = require('moment');
const moment_business = require('moment-business');

/**
 * If a string is a valid date
 * @param {String} date A date
 * @returns {Boolean} If a date string is valid
 */
function isValidDate(date) {
    const m = moment(date);
    return m.isValid();
}

/**
 * If a string is an invalid date
 * @param {String} date A date
 * @returns {Boolean} If a date string is invalid
 */
function isInvalidDate(date) {
    return !isValidDate(date);
}

/**
 * If a date string is on the weekend
 * @param {String} date A date
 * @returns {Boolean} If the date is on a weekend
 */
function isWeekendDate(date) {
    if (!isValidDate(date)) {
        return false;
    }

    const m = moment(date);
    return !moment_business.isWeekDay(m);
}

/**
 * Filters out dates based on the filter method
 * @param {String[]} dates An array of date strings
 * @param {Function} filter The filter to run
 * @returns {String[]} Filtered dates
 */
function filterDates(dates, filter) {
    return dates.filter(filter);
}

/**
 * Checks to see if a date is valid and returns an array of invalid dates
 * @param {String[]} dates An array of date strings
 * @returns {String[]} An array of invalid dates
 */
function getInvalidDates(dates) {
    return filterDates(dates, isInvalidDate);
}

/**
 * Checks to see if a date is on the weekend returns an array of weekend dates
 * @param {String[]} dates An array of date strings
 * @returns {String[]} An array of weekend dates
 */
function getWeekendDates(dates) {
    return filterDates(dates, isWeekendDate);
}

module.exports = {
    filterDates: filterDates,
    isValidDate: isValidDate,
    getInvalidDates: getInvalidDates,
    getWeekendDates: getWeekendDates
};