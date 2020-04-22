const files = require('./files');
const helper_nextweek = require('../scripts/helpers/nextweek');

/**
 * Generates next week's json data
 * @returns {Promise} A promise for when the task is complete
 */
function nextweek() {
    return new Promise(function (resolve, reject) {
        helper_nextweek.getSchedule()
            .then(function (schedule) {
                files.writeData(schedule, 'index.json', 'api/nextweek')
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}

module.exports = nextweek;