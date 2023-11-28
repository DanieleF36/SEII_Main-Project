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