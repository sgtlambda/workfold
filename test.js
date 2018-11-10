'use strict';

const delay = require('delay');

const mutex = require('./');

const handler = (i, initialWait = 0) => async () => {
    console.log(`[${i}] Before delay`);
    await delay(initialWait);
    console.log(`[${i}] Before mutex`);
    await mutex(() => delay(100), 'work');
    console.log(`[${i}] After mutex`);
};

handler(0)();
handler(1, 10)();
handler(2, 20)();
handler(3, 250)();