'use strict';

const running = {};

/**
 * Make sure the given async job (fn) doesn't run concurrently on this thread.
 * @param {Function} fn
 * @param {String} jobId
 * @returns {Promise<*>}
 */
module.exports = async (jobId, fn) => {
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
        } finally {
            running[jobId].forEach(([resolve]) => resolve(result));
            delete running[jobId];
        }
    }
};