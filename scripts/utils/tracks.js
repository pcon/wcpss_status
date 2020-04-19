/**
 * Gets if the traditional schools are in session
 * @returns {Promise} A promise for when the status has been generated
 */
function getTraditionalStatus() {
    return new Promise(function (resolve, reject) {
        reject(new Error('Not implemented yet'));
    });
}

module.exports = {
    getTraditionalStatus: getTraditionalStatus
};