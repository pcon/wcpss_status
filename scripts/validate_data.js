const lodash = require('lodash');

const constants = require('./constants');
const utils = require('./utils');

var promises = [];

lodash.forEach(constants.CALENDAR_TYPES, function (value, key) {
    promises.push(utils.checks.checkCalendars(key));
});

promises.push(utils.checks.checkExceptionFiles());

Promise.allSettled(promises).then(function (results) {
    var errors = [];

    results.forEach(function (result) {
        if (result.status === 'rejected') {
            errors = lodash.concat(errors, result.reason);
        }
    });

    if (!lodash.isEmpty(errors)) {
        console.error(errors);
        process.exit(-1);
    } else {
        console.info('OK');
    }
});