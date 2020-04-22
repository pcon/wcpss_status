const files = require('./files');
const helper_thisweek = require('../scripts/helpers/thisweek');

/**
 * Generates this week's json data
 * @returns {Promise} A promise for when the task is complete
 */
function thisweek() {
    return new Promise(function (resolve, reject) {
        helper_thisweek.getSchedule()
            .then(function (schedule) {
                files.writeData(schedule, 'index.json', 'api/thisweek')
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}

module.exports = thisweek;