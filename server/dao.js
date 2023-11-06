'use strict';

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});
