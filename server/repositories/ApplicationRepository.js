"use strict";

const dayjs = require('dayjs')

const db = require("./db");

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 1025,
  auth: {
    user: 'project.1',
    pass: 'secret.1'
  }
});

/**
 * Performs queries to the database for retriving all the needed information given a supervisor's id
 * 
 * first applications are obtained throught id_teacher, then for each of them student's information are added (name and lastname) as well as thesis information (title and cds)
 * 
 * @param {*} id_teacher 
 * @returns object { application: application, thesis: thesis, student: student } defined in controller file
 */
exports.listApplication = (id_teacher) => {
  const sqlApplication =
    "SELECT innerTable.id_thesis, innerTable.id, innerTable.id_student, title, S.name, S.surname, innerTable.data, innerTable.path_cv, innerTable.status FROM (SELECT id,id_student,path_cv,status,id_thesis,data FROM Application WHERE id_teacher=?) AS innerTable, Thesis AS T, Student AS S WHERE T.id = innerTable.id_thesis AND S.id = innerTable.id_student";
  return new Promise((resolve, reject) => {
    //! QUERY TO THE APPLICATION DATABASE, asks for the whole set of applications given a supervisor's id
    db.all(sqlApplication, [id_teacher], (err, rows) => {
      if (err) {
        console.error("SQLite Error:", err.message);
        reject(err);
        return;
      }
      //! CHECK IF THE APPLICATION EXIST OR NOT
      if (rows.length == 0) {
         reject({ error: "Application not found." });
         return
      } else {
        const application = rows.map((a) => ({
          id_student: a.id_student,
          id_application: a.id,
          id_thesis: a.id_thesis,
          title: a.title,
          name: a.name,
          surname: a.surname,
          data: a.data,
          path_cv: a.path_cv,
          status: a.status
        }))
        resolve(application);
      }
    });
  });
};

exports.addProposal = (studentId, thesisId, cvPath) => {
  return new Promise((resolve, reject) => {
    // Fetch supervisor id based on the given thesisId
    const getSupervisorSql = 'SELECT supervisor FROM Thesis WHERE id = ?';

    db.get(getSupervisorSql, [thesisId], (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      if (!result.supervisor) {
        reject({error: "Not found"});
        return;
      }

      const supervisorId = result.supervisor;
      //Create a current date to add at the new application 
      const currentDate = dayjs().format('YYYY-MM-DD').toString()
      const sql = 'INSERT INTO Application (id_student, id_thesis, data, path_cv, status, id_teacher) VALUES (?, ?, ?, ?, ?, ?)';
      db.run(sql, [studentId, thesisId, currentDate, cvPath, 0, supervisorId], function (err) {
        if (err) {
          reject(err);
        } else {
          // Access the auto-generated ID if needed.
          const insertedId = this.lastID;
          resolve({
            applicationID: insertedId,
            studentId: studentId,
            date: currentDate,
            status: 0,
            professorId: supervisorId
          });
        }
      });
    });
  });
};

exports.acceptApplication = (status, teacherID, applicationID) => {
  return new Promise((resolve, reject) => {
    // 1
    const fetchThesisStudentSQL = 'SELECT id_thesis, id_student FROM Application WHERE id_teacher = ? AND id = ?';
    db.get(fetchThesisStudentSQL, [teacherID, applicationID], (err, row) => {
      if (err) {
        console.error("Error in SQLDatabase:", err.message);
        reject(err);
        return;
      }

      if (!row) {
        reject({ error: "No rows found. Teacher ID or Application ID not found." });
        return;
      }

      const id_thesis = row.id_thesis;
      const id_student = row.id_student;

      // 2
      const updateApplicationSQL = 'UPDATE Application SET status = ? WHERE id_teacher = ? AND id = ?';
      db.run(updateApplicationSQL, [status, teacherID, applicationID], function (err) {
        if (err) {
          console.error("Error in SQLDatabase:", err.message);
          reject(err);
          return;
        }

        // if (this.changes === 0) {
        //   reject({ error: "No rows updated. Teacher ID or Application ID not found." });
        //   return;
        // }

        const teacherMailSQL = 'SELECT email FROM Teacher WHERE id = ? '
        const studentMailCancelledSQL = 'SELECT email FROM Student WHERE id != ? '
        const studentMailSQl = 'SELECT email FROM Student WHERE id = ? '
        const thesisTitlesSQL = 'SELECT title FROM Thesis WHERE id = ?'
        const getThesisTitle = (thesisTitlesSQL, id_thesis) => {
          return new Promise((resolve, reject) => {
            db.get(thesisTitlesSQL, [id_thesis], function (err, result) {
              if (err) {
                console.error("Error in SQLDatabase:", err.message);
                reject(err);
                return;
              }
              resolve(result.title);
            })
          });
        }
        const getTeacherEmail = (teacherMailSQL, teacherID) => {
          return new Promise((resolve, reject) => {
            db.get(teacherMailSQL, [teacherID], function (err, result) {
              if (err) {
                console.error("Error in SQLDatabase:", err.message);
                reject(err);
              } else {
                resolve(result.email);
              }
            });
          });
        };
        const getStudentEmail = (studentMailSQl, id_student) => {
          return new Promise((resolve, reject) => {
            db.get(studentMailSQl, [id_student], function (err, result) {
              if (err) {
                console.error("Error in SQLDatabase:", err.message);
                reject(err);
              } else {
                resolve(result.email);
              }
            });
          });
        };

        const getStudentEmailCancelled = (studentMailCancelledSQL, id_student) => {
          return new Promise((resolve, reject) => {
            db.all(studentMailCancelledSQL, [id_student], function (err, result) {
              if (err) {
                console.error("Error in SQLDatabase:", err.message);
                reject(err);
              } else {
                const emails = result.map((row) => row.email);
                resolve(emails);
              }
            });
          });
        };

        if (status === 1) {
          // 3
          const updateOtherApplicationsSQL = 'UPDATE Application SET status = 3 WHERE id_thesis = ? AND id_student != ?';
          db.run(updateOtherApplicationsSQL, [id_thesis, id_student], function (err) {
            if (err) {
              console.error("Error in SQLDatabase:", err.message);
              reject(err);
              return;
            }
            // 4
            const updateThesisSQL = 'UPDATE Thesis SET status = 0 WHERE id = ?';
            db.run(updateThesisSQL, [id_thesis], function (err) {
              if (err) {
                console.error("Error in SQLDatabase:", err.message);
                reject(err);
                return;
              }
              if (this.changes === 0) {
                reject({ error: "No rows updated. Thesis ID not found." });
                return;
              }
            });
          });
          // Send a notification to all the students with the new status cancelled
          const sendCancelledEmails = () => {
            return Promise.all([
              getTeacherEmail(teacherMailSQL, teacherID),
              getThesisTitle(thesisTitlesSQL, id_thesis),
              getStudentEmailCancelled(studentMailCancelledSQL, id_student),
            ])
              .then(([teacherEmail, thesisTitle, studentEmailCancelledArray]) => {
                const emailPromises = studentEmailCancelledArray.map((element) => {
                  return new Promise((resolve, reject) => {
                    const mailOptions = {
                      from: teacherEmail,
                      to: element,
                      subject: 'Application Status Update',
                      text: `Your application status for ${thesisTitle} has been updated to cancelled.`,
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                        console.error("Error sending email cancelled:", error.message);
                        reject(error);
                      } else {
                        console.log("Email cancelled sent: " + info.response);
                        resolve("cancelled");
                      }
                    });
                  });
                });

                // Wait for all email promises to resolve
                return Promise.all(emailPromises);
              });
          };

          // Send a notification to the student accepted
          const sendAcceptedEmail = () => {
            return Promise.all([
              getTeacherEmail(teacherMailSQL, teacherID),
              getStudentEmail(studentMailSQl, id_student),
              getThesisTitle(thesisTitlesSQL, id_thesis),
            ])
              .then(([teacherEmail, studentEmail, thesisTitle]) => {
                const mailOptions = {
                  from: teacherEmail,
                  to: studentEmail,
                  subject: 'Application Status Update',
                  text: `Your application status for ${thesisTitle} has been updated to accepted.`,
                };
                return transporter.sendMail(mailOptions);
              });
          };

          // Execute the promises sequentially
          sendCancelledEmails()
            .then(() => sendAcceptedEmail())
            .then(() => {
              console.log("All emails sent successfully");
              resolve("accepted");
            })
            .catch((error) => {
              // Handle errors
              console.error("Error:", error.message);
              reject(error);
            });

          resolve({ message: "Application and Thesis updated successfully." });
        } else {
          // If the status is 2 -> rejected, then resolve directly
          Promise.all([
            getTeacherEmail(teacherMailSQL, teacherID),
            getStudentEmail(studentMailSQl, id_student),
            getThesisTitle(thesisTitlesSQL, id_thesis),
          ])
            .then(([teacherEmail, studentEmail, thesisTitle]) => {
              const mailOptions = {
                from: teacherEmail,
                to: studentEmail,
                subject: 'Application Status Update',
                text: `Your application status for ${thesisTitle} has been updated to rejected.`,
              };
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error("Error sending email rejected:", error.message);
                  reject(error);
                } else {
                  console.log("Email rejected sent: " + info.response);
                  resolve("accepted");
                }
              });
            })
            .catch((error) => {
              // Handle errors
              console.error("Error:", error.message);
            });
          resolve({ message: "Application updated successfully." });
        }
      });
    });
  });
};

/**
 * Designed for Virtual clock
 * @param {*} ids of updated thesis  
 */
exports.setCancelledAccordingToThesis = (ids) => {
  const placeholders = ids.map(() => '?').join(',');
  const sql = `UPDATE Application SET status = 3 WHERE id_thesis IN (${placeholders}) AND status = 0`

  return new Promise( (resolve, reject) => {
    db.run(sql, ids, (err) => {
      if(err)
        reject(err)
      resolve(true)
    })
  })
}

/**
 * Designed for Virtual clock
 * @param {*} ids of updated thesis  
 */
exports.setPendingAccordingToThesis = (ids) => {
  const placeholders = ids.map(() => '?').join(',');
  const sql = `UPDATE Application SET status = 0 WHERE id_thesis IN (${placeholders}) AND status = 3`

  return new Promise( (resolve, reject) => {
    db.run(sql, ids, (err) => {
      if(err)
        reject(err)
      resolve(true)
    })
  })
}
