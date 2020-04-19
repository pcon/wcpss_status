/**
 * Gets today's schedule
 * @returns {Promise} A promise for today's schedule
 */
function getSchedule() {
    return new Promise(function (resolve, reject) {
        reject(new Error('Not implemented yet'));
    });
}

module.exports = {
    getSchedule: getSchedule
};