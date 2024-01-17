'use strict'
const passport = require('passport');
const saml = require('passport-saml').Strategy;
const fs = require('fs');
const studentRepository = require('../repositories/StudentRepository');
const teacherRepository = require('../repositories/TeacherRepository');
const coSupervisorRepository = require('../repositories/CoSupervisorRepository');
const SecretaryRepository = require('../repositories/SecretaryRepository.js')

const samlConfig = {
    entryPoint: "https://trial-6639405.okta.com/app/trial-6639405_seii_1/exkaqdefnak4K8Uer697/sso/saml", // URL del punto di ingresso dell'IDP
    logoutUrl: "https://trial-6639405.okta.com/app/trial-6639405_seii_1/exkaqdefnak4K8Uer697/slo/saml",
    logoutCallbackUrl: "http://localhost:3001/logout/callback",
    issuer: 'http://localhost:3001', // Nome del tuo SP
    callbackUrl: "/login/callback",
    protocol: 'http://',
    cert: fs.readFileSync('./config/certs/IDP/IDP.pem', 'utf-8'),
    privateKey: fs.readFileSync('./config/certs/SP/SP_private.pem', 'utf-8'),
    signatureAlgorithm: 'sha256',
    options: { failureRedirect: '/login', failureFlash: true }
};
const samlStrategy = new saml(samlConfig, (profile, done) => {
    let user, role;
    if (profile.nameID.includes('studenti')) {
        studentRepository.getStudentAndCDSByEmail(profile.nameID).then((user) => {
            role = "student";
            user = { id: user.id, name: user.name, surname: user.surname, role: role, nameID: profile.nameID, cds: user.cds, cdsCode: user.cdsCode.includes('LM') ? 1 : 0 }
            done(null, user);
        })
    }
    else if (profile.nameID.includes('professori')) {
        teacherRepository.getByEmail(profile.nameID).then((user) => {
            role = "teacher";
            user = { id: user.id, name: user.name, surname: user.surname, role: role, nameID: profile.nameID, group: user.codGroup }
            done(null, user);
        });
    }
    else if (profile.nameID.includes('cosupervisor')) {
        coSupervisorRepository.getByEmail(profile.nameID).then((user) => {
            role = "cosupervisor";
            user = { id: user.id, name: user.name, surname: user.surname, role: role, nameID: profile.nameID }
            done(null, user);
        })
    }
    else if (profile.nameID.includes('secretary')) {
        SecretaryRepository.getByEmail(profile.nameID).then((user) => {
            role = "secretary";
            user = { id: user.id, name: user.name, surname: user.surname, nameID: profile.nameID }
            done(null, user);
        })
    }
});
passport.use("samlStrategy", samlStrategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.logoutSaml = function (req, res) {
    if (req.user == null) {
        return res.redirect('http://localhost:5173/');
    }
    return samlStrategy.logout(req, function (err, uri) {
        return res.redirect(uri);
    });
};

passport.logoutSamlCallback = function (req, res) {
    req.logout(() => { res.end(); });
    res.redirect('http://localhost:5173/');
}

exports.metadata = () => {
    samlStrategy.generateServiceProviderMetadata('null',
        fs.readFileSync("./SP_cert.pem", "utf8")
    )
}

exports.passport = passport;