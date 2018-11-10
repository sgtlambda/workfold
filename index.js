'use strict';

const running = {};

/**
 * Make sure the given async job (fn) doesn't run concurrently on this thread.
 * @param {Function} fn
 * @param {String} jobId
 * @returns {Promise<*>}
 */
const workfold = async (jobId, fn) => {
    if (jobId in running) {
        await new Promise((resolve, reject) => {
            running[jobId].push([resolve, reject]);
        });
    } else {
        let result;
        try {
            running[jobId] = [];
            result         = await fn();
            return result;
        } catch (e) {
            running[jobId].forEach(([, reject]) => reject(e));
            running[jobId] = [];
            throw e;
        } finally {
            running[jobId].forEach(([resolve]) => resolve(result));
            delete running[jobId];
        }
    }
};

module.exports = workfold;

/**
 * Given a function that turns the input arguments to the job into a job ID,
 * return a "bound" version of workfold that can be called directly
 * @param {Function} mapArguments
 * @param {Function} fn
 * @returns {function(...[*])}
 */
module.exports.bind = (mapArguments, fn) => {
    return (...args) => {
        let jobId = mapArguments(...args);
        return workfold(jobId, () => fn(...args));
    };
};