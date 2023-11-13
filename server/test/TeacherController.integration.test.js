const request = require("supertest");
const controller = require("../controllers/TeacherController.js");
const app = require('../index.js')
const mgmt = require('../mgmt_db.js');