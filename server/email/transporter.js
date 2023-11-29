'use strict';
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    auth: {
        user: 'project.1',
        pass: 'secret.1'
    }
});

exports.sendEmail = (from, to, subject, text) => {
    if(!from)
        throw new Error("from is missing")
    if(!to)
        throw new Error("to is missing")
    const mailOptions = {from, to, subject, text};
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error("Error sending email cancelled:", error.message);
            reject({error: err.message});
            return;
            }
            resolve(info);
        });
    });
}

// Esporta funzioni Private solo per i test
if (process.env.NODE_ENV === 'test') {
    module.exports.transporter = transporter;
}