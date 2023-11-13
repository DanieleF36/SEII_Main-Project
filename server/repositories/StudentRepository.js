'use strict';

const sqlite = require('sqlite3');
require('dotenv').config({path: './variable.env'})

const db = new sqlite.Database(process.env.INUSE_DATABASE, (err) => {
    if(err) throw err;
});