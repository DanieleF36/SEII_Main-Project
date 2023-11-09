"use strict";
const express = require("express");
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require("express-validator"); // validation middleware
const dao = require("./dao"); // module for accessing the DB
const session = require("express-session"); // enable sessions
const userDao = require("./user-dao"); // module for accessing the user info in the DB
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

app.get("/thesis", (req, res) =>
  thesisController.advancedResearchThesis(req, res)
);
app.get("/professor/:id_professor/applications", (req, res) =>
  teacherController.listApplication(req, res)
);
app.post("/professor/:id_professor/applications/:id_application", (req, res) =>
  teacherController.accRefApplication(req, res)
);

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
