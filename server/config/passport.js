'use strict'
const passport = require('passport');
const saml = require('passport-saml').Strategy;
const fs = require('fs');
const studentRepository = require('../repositories/StudentRepository');
const teacherRepository = require('../repositories/TeacherRepository');
const coSupervisorRepository = require('../repositories/CoSupervisorRepository');

const samlConfig = {
    entryPoint: "https://trial-4857036.okta.com/app/trial-4857036_seiigroup14_1/exk9if2411VvR5eOK697/sso/saml", // URL del punto di ingresso dell'IDP
    issuer: 'http://localhost:3001', // Nome del tuo SP
    callbackUrl: "/login/callback",
    protocol: 'http://',
    cert: fs.readFileSync('./IDP.pem', 'utf-8'),
    options:{ failureRedirect: '/login', failureFlash: true }
};
const samlStrategy = new saml(samlConfig, (profile, done) => {
    const email = profile.nameID.toLowerCase();
    let user, role;
    if(email.includes('studenti') || email.includes('studenti')){
        user = studentRepository.findByEmail(email);
        role = "student";
    }
    else if(email.includes('professori') || email.includes('professori')){
        user = teacherRepository.findByEmail(email);
        role = "teacher";
    }
    else if(email.includes('supervisor') || email.includes('supervisor')){
        user = coSupervisorRepository.findByEmail(email);
        role = "supervisor";
    }
    user = {id:user.id, name:user.name, surname:user.surname, role:role}
    console.log(user)
    return done(null, user);
});
passport.use("samlStrategy", samlStrategy);
    // Configurazione delle serializzazioni per la sessione utente
    passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

exports.passport = passport;