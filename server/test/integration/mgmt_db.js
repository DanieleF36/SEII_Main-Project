'use strict';

const sqlite = require('sqlite3');
const dayjs = require('dayjs')
const db = new sqlite.Database('dbtest.sqlite', (err) => {
    if (err) throw err;
});

/**
 * Utils file for managing the testing database, there are several function for cleaning the tables
 * which are going to be called beforeEach or afterEach test is done. 
 * The function are at the end of the file with the following format `clean[TABLE's name]`
 */

const createSchemaSQL = `
    CREATE TABLE IF NOT EXISTS Application (
        "id"	INTEGER,
        "id_student"	INTEGER NOT NULL,
        "id_thesis"	INTEGER NOT NULL,
        "data"	DATE,
        "path_cv"	TEXT,
        "status"	INTEGER NOT NULL,
        "id_teacher"	INTEGER NOT NULL,
        FOREIGN KEY("id_thesis") REFERENCES "Thesis"("id"),
        FOREIGN KEY("id_student") REFERENCES "Student"("id"),
        PRIMARY KEY("id")
    );
    CREATE TABLE IF NOT EXISTS Career (
        "idauto" INTEGER
        "id"	INTEGER,
        "cod_course"	INTEGER NOT NULL,
        "title_course"	TEXT NOT NULL,
        "cfu"	INTEGER NOT NULL,
        "grade"	INTEGER NOT NULL,
        "date"	DATE NOT NULL,
        PRIMARY KEY("idauto")
    );
    CREATE TABLE IF NOT EXISTS CoSupervisor (
        "id"	INTEGER,
        "email"	TEXT UNIQUE,
        "name"	TEXT,
        "surname"	TEXT,
        "company"	TEXT,
        PRIMARY KEY("id")
    );
    CREATE TABLE IF NOT EXISTS CoSupervisorThesis (
        "id"	INTEGER,
        "id_thesis"	INTEGER NOT NULL,
        "id_teacher"	INTEGER,
        "id_cosupervisor"	INTEGER,
        PRIMARY KEY("id"),
        FOREIGN KEY("id_cosupervisor") REFERENCES "CoSupervisor"("id"),
        FOREIGN KEY("id_thesis") REFERENCES "Thesis"("id"),
        FOREIGN KEY("id_teacher") REFERENCES "Teacher"("id")
    );
    CREATE TABLE IF NOT EXISTS Degree (
        "cod"	INTEGER,
        "title"	INTEGER NOT NULL,
        PRIMARY KEY("cod")
    );
    CREATE TABLE IF NOT EXISTS Student (
        "id"	INTEGER,
        "surname"	TEXT,
        "name"	TEXT,
        "gender"	INTEGER,
        "nationality"	TEXT,
        "email"	TEXT UNIQUE,
        "cod_degree"	INTEGER NOT NULL,
        "enrol_year"	INTEGER NOT NULL,
        PRIMARY KEY("id")
    );
    CREATE TABLE IF NOT EXISTS Teacher (
        "id"	INTEGER,
        "surname"	TEXT,
        "name"	TEXT,
        "email"	TEXT UNIQUE,
        "code_group"	INTEGER NOT NULL,
        "cod_dep"	INTEGER NOT NULL,
        PRIMARY KEY("id")
    );
    CREATE TABLE IF NOT EXISTS Thesis (
        "id"	INTEGER,
        "title"	TEXT UNIQUE,
        "supervisor"	INTEGER NOT NULL,
        "keywords"	TEXT,
        "type"	TEXT NOT NULL,
        "groups"	TEXT NOT NULL,
        "description"	TEXT,
        "knowledge"	TEXT,
        "note"	TEXT,
        "expiration_date"	DATE NOT NULL,
        "level"	INTEGER NOT NULL,
        "cds"	TEXT NOT NULL,
        "creation_date"	DATE,
        "status"	INTEGER NOT NULL,
        PRIMARY KEY("id"),
        FOREIGN KEY("supervisor") REFERENCES "Teacher"("id")
    );
`;

const insertDataSQL = `
    INSERT INTO Degree ("cod", "title") VALUES
    (1, 'Computer Science'),
    (2, 'Electrical Engineering'),
    (3, 'Mechanical Engineering');

    INSERT INTO Teacher ("id", "surname", "name", "email", "code_group", "cod_dep") VALUES
    (1, 'Smith', 'John', 'john.smith@example.com', 101, 1),
    (2, 'Johnson', 'Emma', 'emma.johnson@example.com', 102, 2),
    (3, 'Davis', 'Michael', 'michael.davis@example.com', 103, 3);
    
    INSERT INTO Student ("id", "surname", "name", "gender", "nationality", "email", "cod_degree", "enrol_year") VALUES
    (1, 'Brown', 'Alice', 0, 'US', 'alice.brown@example.com', 1, 2020),
    (2, 'Miller', 'Robert', 1, 'UK', 'robert.miller@example.com', 2, 2019),
    (3, 'Garcia', 'Sophia', 0, 'FR', 'sophia.garcia@example.com', 3, 2021),
    (4, 'Chen', 'David', 1, 'CN', 'david.chen@example.com', 1, 2022),
    (5, 'Kim', 'Jisoo', 0, 'KR', 'jisoo.kim@example.com', 2, 2021),
    (6, 'Singh', 'Amit', 1, 'IN', 'amit.singh@example.com', 3, 2022);
    
    INSERT INTO Thesis ("id", "title", "supervisor", "keywords", "type", "groups", "description", "knowledge", "note", "expiration_date", "level", "cds", "creation_date", "status") VALUES
    (1, 'AI in Robotics', 1, 'AI, Robotics', 'Research', 'Robotics', 'Exploring the integration of AI in robotics for autonomous decision-making.', 'Machine Learning, Robotics', 'This is a cutting-edge topic in the field.', '2023-05-01', 1, 'CDS001', '2022-12-01', 1),
    (2, 'Renewable Energy Systems', 2, 'Renewable Energy, Sustainability', 'Development', 'Energy Systems', 'Design and development of sustainable energy systems using renewable sources.', 'Energy Engineering, Sustainability', 'Important for addressing climate change.', '2023-06-01', 2, 'CDS002', '2022-11-15', 1),
    (3, 'Human-Computer Interaction', 3, 'HCI, User Experience', 'Research', 'HCI', 'Investigating user experience and interaction design in software development.', 'HCI, User Interface Design', 'Focus on improving user satisfaction.', '2023-04-01', 1, 'CDS003', '2022-10-20', 1),
    (4, 'Blockchain Applications', 1, 'Blockchain, Distributed Ledger', 'Research', 'Technology', 'Exploring applications of blockchain technology in various industries.', 'Blockchain, Cryptography', 'Focus on decentralized and secure solutions.', '2023-07-01', 2, 'CDS004', '2023-01-15', 1),
    (5, 'Smart Cities', 2, 'IoT, Urban Planning', 'Development', 'Smart Cities', 'Designing and implementing smart city solutions for urban development.', 'IoT, Urban Design', 'Addressing urban challenges through technology.', '2023-08-15', 1, 'CDS005', '2023-02-20', 1),
    (6, 'Data Privacy and Security', 3, 'Data Privacy, Cybersecurity', 'Research', 'Security', 'Investigating strategies for ensuring data privacy and security in modern information systems.', 'Cybersecurity, Encryption', 'Critical for safeguarding sensitive information.', '2023-09-01', 2, 'CDS006', '2023-03-10', 1);

    
    INSERT INTO CoSupervisor ("id", "email", "name", "surname", "company") VALUES
    (1, 'cosupervisor1@example.com', 'Mark', 'Johnson', 'Tech Innovations'),
    (2, 'cosupervisor2@example.com', 'Laura', 'Williams', 'Green Energy Solutions'),
    (3, 'cosupervisor3@example.com', 'Chris', 'Anderson', 'AI Solutions Ltd.');
    
    INSERT INTO CoSupervisorThesis ("id", "id_thesis", "id_teacher", "id_cosupervisor") VALUES
    (1, 1, 1, 1),
    (2, 2, 2, 2),
    (3, 3, 3, 3);

    INSERT INTO Career ("id", "cod_course", "title_course", "cfu", "grade", "date") VALUES
    (1, 1, 101, 'Software Engineering', 30, 90, '2023-07-15'),
    (2, 2, 102, 'Electrical Systems', 25, 85, '2023-08-20'),
    (3, 3, 103, 'Mechanical Design', 28, 88, '2023-06-10'),
    (4, 4, 104, 'Data Science', 32, 92, '2023-09-30'),
    (5, 5, 105, 'Civil Engineering', 27, 86, '2023-07-05'),
    (6, 6, 106, 'Biomedical Engineering', 30, 88, '2023-08-15');

    INSERT INTO Application ("id", "id_student", "id_thesis", "data", "path_cv", "status", "id_teacher") VALUES
    (1, 1, 1, '2023-02-15', '/cv/alice_brown_cv.pdf', 1, 1),
    (2, 2, 2, '2023-01-20', '/cv/robert_miller_cv.pdf', 2, 2),
    (3, 3, 3, '2023-03-05', '/cv/sophia_garcia_cv.pdf', 1, 3);
`;

const deleteDataSql = `
    DELETE FROM Application;
    DELETE FROM Career;
    DELETE FROM CoSupervisor;
    DELETE FROM CoSupervisorThesis;
    DELETE FROM Degree;
    DELETE FROM Student;
    DELETE FROM Teacher;
    DELETE FROM Thesis;
`

exports.loadData = () => {
    const queries = insertDataSQL.split(';').map(query => query.trim());

    const promises = queries.map(query => {
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    });

    return Promise.all(promises)
        .then(() => {
            return true;
        })
        .catch(error => {
            throw error;
        });
}


exports.loadSchema = () => {
    const queries = createSchemaSQL.split(';').map(query => query.trim());

    const promises = queries.map(query => {
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    });

    return Promise.all(promises)
        .then(() => {
            return true;
        })
        .catch(error => {
            throw error;
        });

}


exports.cleanTable = () => {
    const queries = deleteDataSql.split(';').map(query => query.trim());

    const promises = queries.map(query => {
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    });

    return Promise.all(promises)
        .then(() => {
            return true;
        })
        .catch(error => {
            throw error;
        });
}


// =======================================================Utils functions================================================================

exports.cleanThesis = () => {
    const query = 'DELETE FROM Thesis';

    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.cleanApplication = () => {
    const query = 'DELETE FROM Application';

    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.cleanCareer = () => {
    const query = 'DELETE FROM Career';

    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.cleanCoSupervisor = () => {
    const query = 'DELETE FROM CoSupervisor';

    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.cleanCoSupervisorThesis = () => {
    const query = 'DELETE FROM CoSupervisorThesis';

    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.cleanDegree = () => {
    const query = 'DELETE FROM Degree';

    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.cleanStudent = () => {
    const query = 'DELETE FROM Student';

    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.cleanTeacher = () => {
    const query = 'DELETE FROM Teacher';

    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

//-------------------------------------------------INSERT INTO--------------------------------------------

/**
 * Insert an entry into TEACHER table
 * @param {*} id 
 * @param {*} surname 
 * @param {*} name 
 * @param {*} email 
 * @param {*} code_group 
 * @param {*} cod_dep 
 */
exports.insertIntoTeacher = (id, surname, name, email, code_group, cod_dep) => {
    const query = `INSERT INTO Teacher ("id", "surname", "name", "email", "code_group", "cod_dep") VALUES
    (?, ?, ?, ?, ?, ?)`

    return new Promise((resolve, reject) => {
        db.run(query, [id, surname, name, email, code_group, cod_dep], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Insert an entry into COSUPERVISOR table
 * @param {*} id 
 * @param {*} email 
 * @param {*} name 
 * @param {*} surname 
 * @param {*} company 
 */
exports.insertIntoCoSupervisor = (id, email, name, surname, company) => {
    const query = `INSERT INTO CoSupervisor ("id", "email", "name", "surname", "company") VALUES
    (?, ?, ?, ?, ?)`

    return new Promise((resolve, reject) => {
        db.run(query, [id, email, name, surname, company], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.insertIntoCoSupervisorThesis = (id_thesis, id_cosupervisor, id_teacher) => {
    const query = `INSERT INTO CoSupervisorThesis ("id_thesis", "id_cosupervisor", "id_teacher") VALUES
    (?, ?, ?)`

    return new Promise((resolve, reject) => {
        db.run(query, [id_thesis, id_cosupervisor, id_teacher], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Insert into THESIS table
 * @param {*} id 
 * @param {*} email 
 * @param {*} name 
 * @param {*} surname 
 * @param {*} company 
 * @returns 
 */
exports.insertIntoThesis = (id, title, supervisor, keywords, type, groups, description, knowledge, note, expiration, level, cds, creation_date, status) => {
    const query = `INSERT INTO Thesis ("id", "title", "supervisor", "keywords", "type", 
                    "groups", "description", "knowledge", "note", "expiration_date", "level", 
                    "cds", "creation_date", "status") VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    return new Promise((resolve, reject) => {
        db.run(query, [id, title, supervisor, keywords, type, groups, description, knowledge, note, expiration, level, cds, creation_date, status], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Insert into APPLICATION table 
 * @param {*} studentId 
 * @param {*} thesisId 
 * @param {*} cvPath 
 * @param {*} supervisorId
 * @param {*} status
 */
exports.insertIntoApplication = (id, studentId, thesisId, cvPath, supervisorId, status) => {
    const currentDate = dayjs().format('YYYY-MM-DD').toString()
    const sql = 'INSERT INTO Application (id, id_student, id_thesis, data, path_cv, status, id_teacher) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.run(sql, [id, studentId, thesisId, currentDate, cvPath, status, supervisorId], function (err) {
            if (err) {
                return reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    })
};

/**
 * Insert into STUDENT table
 * @param {*} id 
 * @param {*} surname 
 * @param {*} name 
 * @param {*} gender 
 * @param {*} nationality
 * @param {*} email 
 * @param {*} cod_degree 
 * @param {*} enrol_year 
 */
exports.insertIntoStudent = (id, surname, name, gender, nationality, email, cod_degree, enrol_year) => {
    const sql = 'INSERT INTO Student ("id", "surname","name","gender","nationality","email","cod_degree","enrol_year") VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.run(sql, [id, surname, name, gender, nationality, email, cod_degree, enrol_year], function (err) {
            if (err) {
                return reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

/**
 * Insert into CAREER table
 * @param {*} idauto 
 * @param {*} id id of the student to insert intoCareer
 * @param {*} cod_course 
 * @param {*} title_course 
 * @param {*} cfu 
 * @param {*} grade 
 * @param {*} date 
 * @returns 
 */
exports.insertIntoCareer = (idauto, id, cod_course, title_course, cfu, grade, date) => {
    const sql = 'INSERT INTO Career ("idauto", "id","cod_course","title_course","cfu","grade","date") VALUES (?, ?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.run(sql, [idauto, id, cod_course, title_course, cfu, grade, date], function (err) {
            if (err) {
                return reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

//-------------------------------------------------GET--------------------------------------------

exports.getFromThesis = () => {
    const sql = 'SELECT * FROM Thesis';
    return new Promise((resolve, reject) => {
        db.all(sql, [], function (err, rows) {
            if (err) {
                return reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}