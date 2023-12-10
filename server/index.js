"use strict";
const express = require("express");
const morgan = require("morgan"); // logging middleware
const session = require("express-session"); // enable sessions
const cors = require("cors");
const passport = require('./config/passport').passport;
const metadata = require('./config/passport').metadata;
const app = express();
require('dotenv').config({path: './variable.env'})

/* json schema validator */
const { Validator, ValidationError } = require('express-json-validator-middleware');
const fs = require('fs');

const addFormats = require('ajv-formats').default;
const thesisSchema = JSON.parse(fs.readFileSync('./json_schema/thesisSchema.json').toString());
const querySearch = JSON.parse(fs.readFileSync('./json_schema/querySearch.json').toString());
const validator = new Validator({ allErrors: true });
validator.ajv.addSchema(thesisSchema);
addFormats(validator.ajv);
const validate = validator.validate;
/* end json schema validator*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(session({
  secret: "myLittleDirtySecret",
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false })); // Replaces Body Parser

// login_as TOBE discussed
let login_as = {user: undefined}
const isLoggedIn = (req, res, next)=>{
  
  if(process.env.NODE_ENV === 'test') {
    req.user = login_as.user

  }
  else if (!req.isAuthenticated()) {
    return res.status(401).json({error: 'Unauthorized'});
  } 
  return next();
}

/******************************************************************Route*********************************************************************************************/

const thesisController = require("./controllers/ThesisController");
const coSupervisorController = require("./controllers/CoSupervisorController");
const applicationController = require("./controllers/ApplicationController");
const vc = require('./dayjsvc/index.dayjsvc')

app.get("/thesis", isLoggedIn, (req, res) => thesisController.searchThesis(req,res, validate({query: querySearch})));

app.post("/thesis", isLoggedIn, validate({body: thesisSchema}), (req, res) => thesisController.addThesis(req, res));

app.put("/thesis/:id", isLoggedIn, validate({body: thesisSchema}), (req, res) => thesisController.updateThesis(req, res));

app.post("/thesis/:id_thesis/applications", isLoggedIn, (req, res) => applicationController.applyForProposal(req, res));

app.get("/applications", isLoggedIn, (req, res) => applicationController.listApplication(req, res));

app.put("/applications/:id_applications", applicationController.acceptApplication);

app.get("/cosupervisors/email", isLoggedIn, (req, res) => coSupervisorController.getAllCoSupervisorsEmails(req, res));

app.get("/applications/student_cv/:id_student", applicationController.getStudentCv);

app.get("/applications/career/:id_student",applicationController.getCareerByStudentId)


app.post("/testing/vc/set", (req, res) => vc.vc_set(req, res))

app.post("/testing/vc/restore", (req, res) => vc.vc_restore(req, res))

app.get("/testing/vc/get", (req, res) => vc.vc_current(req, res))

/******************************************************************Login*********************************************************************************************/

app.get('/login', passport.authenticate('samlStrategy'),(req, res)=>res.redirect('http://localhost:5173/home'));

app.post('/login/callback', passport.authenticate('samlStrategy'), (req, res)=>res.redirect('http://localhost:5173/home'));

app.get('/logout', passport.logoutSaml);

app.post('/logout/callback', passport.logoutSamlCallback);

app.get("/metadata", (req, res)=>res.type("application/xml").status(200).send(metadata()));

app.get("/session/current", isLoggedIn, (req, res)=>{let u = {name: req.user.name, surname: req.user.surname, id: req.user.id, email:req.user.nameID, cds: req.user.cds, role: req.user.role}; res.status(200).send(u)})

app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
      res.status(400).send({error: err.validationErrors});
  } else next(err);
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
module.exports = {app, login_as};