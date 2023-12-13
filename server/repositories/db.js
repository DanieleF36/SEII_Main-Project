"use strict";

const sqlite = require("sqlite3");
const dayjs = require('dayjs')

require('dotenv').config({path: './variable.env'})
const db = new sqlite.Database(process.env.INUSE_DATABASE, (err) => {
  if (err) throw err;
});

module.exports = db;