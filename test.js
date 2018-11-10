'use strict';

const delay = require('delay');

const mutex = require('./');

const handler = (i, initialWait = 0) => async () => {
    console.log(`[${i}] Before delay`);
    await delay(initialWait);
    console.log(`[${i}] Before mutex`);
    await mutex(() => delay(2500), 'work');
    console.log(`[${i}] After mutex`);
};

handler(0)();
handler(1, 750)();
handler(2, 1500)();
handler(3, 3000)();