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

var message = {
  from: 'morisio@server.com',
  to: 'francesco@sender.com',
  subject: 'Application Response',
  text: 'Congratulations!'
};

transporter.sendMail(message, (error, info) => {
  if (error) {
    console.log('Error occurred');
    console.log(error.message);
    return process.exit(1);
  }
  console.log('Message sent successfully');
  console.log(info);
  transporter.close();
});

//const nodemailer = require('nodemailer');
// //!POSSIBLE ACCEPT APPLICATION CHANGES
// //Create a nodemailer transporter using your email service provider's details
// const transporter = nodemailer.createTransport({
//     host: '127.0.0.1',
//     port: 1025,
//     auth: {
//       user: 'project.1',
//       pass: 'secret.1'
//     }
// });

// exports.acceptApplication = (status, teacherID, applicationID, studentEmail) => {
//   return new Promise((resolve, reject) => {
//     const sql = 'UPDATE Application SET status = ? WHERE id_teacher = ? AND id = ?';
//     db.run(sql, [status, teacherID, applicationID], function (err) {
//       if (err) {
//         console.error("Error in SQLDatabase:", err.message);
//         reject(err);
//         return;
//       } else {
//         if (this.changes === 0) {
//           reject({ error: "No rows updated. Teacher ID or Application Id not found." });
//           return;
//         }

//         // Send email to the student
//         const mailOptions = {
//           from: 'your_email@example.com',
//           to: studentEmail,
//           subject: 'Application Status Update',
//           text: `Your application status has been updated to ${status}.`,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.error("Error sending email:", error.message);
//             reject(error);
//           } else {
//             console.log("Email sent: " + info.response);
//             resolve(status);
//           }
//         });
//       }
//     });
//   });
// };
