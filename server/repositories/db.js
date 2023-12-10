"use strict";

const sqlite = require("sqlite3");

require('dotenv').config({path: './variable.env'})
const db = new sqlite.Database('./db.sqlite', (err) => {
  if (err) throw err
});

module.exports = db;