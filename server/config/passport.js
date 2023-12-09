'use strict'
const passport = require('passport');
const saml = require('passport-saml').Strategy;
const fs = require('fs');
const studentRepository = require('../repositories/StudentRepository');
const teacherRepository = require('../repositories/TeacherRepository');
const coSupervisorRepository = require('../repositories/CoSupervisorRepository');

const samlConfig = {
    entryPoint: "https://trial-4857036.okta.com/app/trial-4857036_seiigroup14_1/exk9if2411VvR5eOK697/sso/saml", // URL del punto di ingresso dell'IDP
    logoutUrl: "https://trial-4857036.okta.com/app/trial-4857036_seiigroup14_1/exk9if2411VvR5eOK697/slo/saml",
    logoutCallbackUrl: "http://localhost:3001/logout/callback",
    issuer: 'http://localhost:3001', // Nome del tuo SP
    callbackUrl: "/login/callback",
    protocol: 'http://',
    cert: fs.readFileSync('./config/certs/IDP/IDP.pem', 'utf-8'),
    privateKey: fs.readFileSync('./config/certs/SP/SP_private.pem', 'utf-8'),
    signatureAlgorithm: 'sha256',
    options:{ failureRedirect: '/login', failureFlash: true }
};
const samlStrategy = new saml(samlConfig, (profile) => {
    let user, role;
    if(profile.nameID.includes('studenti') ){
        studentRepository.getStudentAndCDSByEmail(profile.nameID)
            .then((u) => user = u)
            .catch((err) => user = undefined)
        role = "student";
    }
    else if(profile.nameID.includes('professori') ){
        teacherRepository.getByEmail(profile.nameID)
            .then((u) => user = u)
            .catch((err) => user = undefined)
        role = "teacher";
    }
    else if(profile.nameID.includes('cosupervisor') ){
        coSupervisorRepository.getByEmail(profile.nameID)
            .then((u) => user = u)
            .catch((err) => user = undefined)
        role = "cosupervisor";
    }
    if(role==='student')
        user = { id:user.id, name:user.name, surname:user.surname, role:role, nameID:profile.nameID, cds:user.cds, cdsCode:user.cdsCode }
    else if(role==='teacher')
        user = { id:user.id, name:user.name, surname:user.surname, role:role, nameID:profile.nameID, group:user.code_group }
    else
        user = { id:user.id, name:user.name, surname:user.surname, role:role, nameID:profile.nameID }
    
});
passport.use("samlStrategy", samlStrategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.logoutSaml = function(req, res) {
    if (req.user == null) {
        return res.redirect('http://localhost:5173/');
    }
    return samlStrategy.logout(req, function(err, uri) {
        return res.redirect(uri);
    });
};

passport.logoutSamlCallback = function(req, res){
    req.logout(()=> { res.end(); });
    res.redirect('http://localhost:5173/');
}

exports.metadata = ()=>{
    samlStrategy.generateServiceProviderMetadata('null',
        fs.readFileSync("./SP_cert.pem", "utf8")
    )
}

exports.passport = passport;