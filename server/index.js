"use strict";
const express = require("express");
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require("express-validator"); // validation middleware
const session = require("express-session"); // enable sessions
const cors = require("cors");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
};
app.use(cors(corsOptions));

const answerDelay = 300;

app.use(
  session({
    secret: "anjndaljjahuiq8989",
    resave: false,
    saveUninitialized: false,
  })
);

const thesisController = require("./controllers/ThesisController");
const teacherController = require("./controllers/TeacherController");
const studentController = require("./controllers/StudentController");
const vc = require('./dayjsvc/index.dayjsvc')

app.get("/thesis", (req, res) =>
  thesisController.advancedResearchThesis(req, res)
);
app.get("/professor/:id_professor/applications", (req, res) =>
  teacherController.listApplication(req, res)
);

app.post("/thesis", (req, res) => thesisController.addThesis(req, res));

app.put("/professor/:id_professor/applications/:id_application", (req, res) =>
  teacherController.acceptApplication(req, res)
);

app.post("/thesis/:id_thesis/applications", (req, res) => studentController.applyForProposal(req, res));

app.get("/student/:id_student/applications", (req, res) =>
  studentController.browserApplicationStudent(req, res)
);

app.post("/testing/vc/set", (req, res) => vc.vc_set(req, res))

app.post("/testing/vc/restore", (req, res) => vc.vc_restore(req, res))

app.get("/testing/vc/get", (req, res) => vc.vc_current(req, res))
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
module.exports = app;