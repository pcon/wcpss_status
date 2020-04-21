const files = require('./files');
const helper_today = require('../scripts/helpers/tomorrow');

/**
 * Generates today's json data
 * @returns {Promise} A promise for when the task is complete
 */
function today() {
    return new Promise(function (resolve, reject) {
        helper_today.getSchedule()
            .then(function (schedule) {
                files.writeData(schedule, 'index.json', 'api/tomorrow')
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}

module.exports = today;