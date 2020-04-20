const lodash = require('lodash');
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
 * If the date is in the same year
 * @param {Number} year A year
 * @param {String} date A date
 * @returns {Boolean} If the date and the year are the same
 */
function isSameYear(year, date) {
    return moment(date).isSame(moment().year(year), 'year');
}

/**
 * If the date is not in the same year
 * @param {Number} year A year
 * @param {String} date A date
 * @returns {Boolean} If the date and the year are not the same
 */
function isNotSameYear(year, date) {
    return !isSameYear(year, date);
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
 * @param {Number} year The year
 * @returns {String[]} An array of invalid dates
 */
function getInvalidDates(dates, year) {
    const invalid_dates = filterDates(dates, isInvalidDate);

    if (!year) {
        return invalid_dates;
    }

    const isNotSameYear_bound = isNotSameYear.bind(null, year);
    const wrong_year = filterDates(lodash.difference(dates, invalid_dates), isNotSameYear_bound);

    return lodash.union(invalid_dates, wrong_year);
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
    isInvalidDate: isInvalidDate,
    isSameYear: isSameYear,
    isNotSameYear: isNotSameYear,
    isWeekendDate: isWeekendDate,
    getInvalidDates: getInvalidDates,
    getWeekendDates: getWeekendDates
};