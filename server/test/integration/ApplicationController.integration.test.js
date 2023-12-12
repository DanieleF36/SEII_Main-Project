const request = require("supertest");
let { app, login_as } = require('../../index.js')
const mgmt = require('./mgmt_db.js');
const dayjs = require('dayjs')

let server;
beforeAll(() => {
    server = app.listen(3001)
})
afterAll((done) => {
    server.close(done);
});

login_as.user = {
    id: 1,
    name: 'Gianni',
    lastname: 'Altobelli',
    nameID: 'gianni.altobelli@email.it',
    role: 'student',
    cds: 'Computer Science',
    cdsCode: 1
}

afterEach(async () => {
    await mgmt.cleanApplication()
    await mgmt.cleanStudent()
});

describe("LIST APPLICATION INTEGRATION TEST", () => {
    let application, student;
    beforeEach(async () => {
        await mgmt.cleanApplication()
        login_as.user = {
            id: 1,
            name: 'Gianni',
            lastname: 'Altobelli',
            nameID: 'gianni.altobelli@email.it',
            role: 'teacher',
            group: 'group1'
        }

        application = {
            id: 1,
            studentId: 1,
            thesisId: 1,
            cvPath: "prova.pdf",
            supervisorId: 1,
            status: 1
        }
        student = {
            name: "Giuseppe",
            surname: "Sculli",
            gender: "male",
            email: "sculli@mail.com",
            cod_degree: 1,
            enrol_year: 2010,
            nationality: "italian"
        }
    })

    afterAll(async () => {
        await mgmt.cleanApplication()
    })

    test("I1: You can not access to this route", async () => {
        login_as.user.role = "wrong role"
        const response = await request(app).get('/applications')
        expect(response.status).toBe(401)
    })
    test("I2: Given supervisor's id is not valid (teacher)", async () => {
        login_as.user.id = ""
        const response = await request(app).get('/applications')
        expect(response.status).toBe(500)
    })
    test("I3: list Application done (teacher)", async () => {
        await mgmt.insertIntoApplication(1,application.studentId, application.thesisId, application.cvPath, application.supervisorId, application.status);
        await mgmt.insertIntoStudent(student.surname, student.name, student.gender, student.nationality, student.email, student.cod_degree, student.enrol_year)
        const response = await request(app).get('/applications')
        expect(response.status).toBe(200)
    })
    test("I4: You can not access to this route", async () => {
        login_as.user.role = "wrong role"
        const response = await request(app).get('/applications')
        expect(response.status).toBe(401)
    })
    test("I5: Given student's id is not valid (student)", async () => {
        login_as.user.id = ""
        login_as.user.role = "student"
        const response = await request(app).get('/applications')
        expect(response.status).toBe(500)
    })
    test("I6: list Application done (student)", async () => {
        login_as.user.role = "student"
        await mgmt.insertIntoApplication(1,application.studentId, application.thesisId, application.cvPath, application.supervisorId, application.status);
        await mgmt.insertIntoStudent(student.surname, student.name, student.gender, student.nationality, student.email, student.cod_degree, student.enrol_year)
        const response = await request(app).get('/applications')
        expect(response.status).toBe(200)
    })
})

describe("ACCEPT APPLICATION INTEGRATION TEST", () => {
    beforeEach(async () => {
        await mgmt.cleanApplication()
        await mgmt.cleanThesis();
        await mgmt.cleanTeacher();
        login_as.user = {
            id: 1,
            name: 'Gianni',
            lastname: 'Altobelli',
            nameID: 'gianni.altobelli@email.it',
            role: 'teacher',
            group: 'group1'
        }

        application = {
            id: 1,
            studentId: 1,
            thesisId: 1,
            cvPath: "prova.pdf",
            supervisorId: 1,
            status: 1
        }
        student = {
            name: "Giuseppe",
            surname: "Sculli",
            gender: "male",
            email: "sculli@mail.com",
            cod_degree: 1,
            enrol_year: 2010,
            nationality: "italian"
        }
    })

    afterAll(async () => {
        await mgmt.cleanApplication()
    })
    
    jest.spyOn(require('../../email/transporter.js'), 'sendEmail').mockResolvedValue(true)
    test("I1: role != teacher", async () => {
        login_as.user.role='student';
        const res = await request(app).put('/applications/1');
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({ message: "You can not access to this route" })
    });

    test("I2: wronged id", async () => {
        const res = await request(app).put('/applications/-1');
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({ message: "Wronged id application" })
    });

    test("I3: missing body", async () => {
        const res = await request(app).put('/applications/1');
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({ message: "Missing new status acceptApplication" })
    });

    test("I4: status 3", async () => {
        const res = await request(app).put('/applications/1').send({status: 3}).set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({ message: "Invalid new status entered" })
    });
    test("I5: error in applicationRepository.getById", async () => {
        const spy = jest.spyOn(require('sqlite3').Database.prototype, 'get');
        spy.mockImplementation((sql, params, callback) => {
            callback(new Error("some"), null);
        });
        const res = await request(app).put('/applications/1').send({status: 1}).set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
        expect(res.body).toEqual({ message: "some" })
    });
    test("I6: applicationRepository.getById return undefined", async () => {
        const spy = jest.spyOn(require('sqlite3').Database.prototype, 'get');
        spy.mockImplementation((sql, params, callback) => {
            callback(null, undefined);
        });
        const res = await request(app).put('/applications/1').send({status: 1}).set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
        expect(res.body).toEqual({ message: "No application was found, application is missing or is of another teacher" });
        spy.mockRestore();   
    });
    
    test("I7: applicationRepository.updateStatus fails", async () => {
        await mgmt.insertIntoApplication(1,1,1,"path",1,0)
        const spy = jest.spyOn(require('sqlite3').Database.prototype, 'run');
        spy.mockImplementation((sql, params, callback) => {
            callback(new Error("some"),null);
        });
        const res = await request(app).put('/applications/1').send({status: 1}).set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
        expect(res.body).toEqual({ message: "some" })
        spy.mockRestore();  
    });

    test("I11: success", async () => {
        await mgmt.insertIntoStudent("","",0, "","c.b@email.it",0,0)
        await mgmt.insertIntoTeacher(1, "", "", "a.b@email.it", 0, 0)
        await mgmt.insertIntoThesis(1, "title", 1, "", "", "", "", "", "", "", 0, "", "", 1);
        await mgmt.insertIntoApplication(1,1,1,"path",1,0)
        
        const res = await request(app).put('/applications/1').send({status: 1}).set('Content-Type', 'application/json');
        
        //expect(res.status).toEqual(200);
        expect(res.body).toEqual(1);
         
        require('../../repositories/ThesisRepository.js').restoredb;
    });

    test("I8: updateStatusToCancelledForOtherStudent fails", async () => {
        await mgmt.insertIntoApplication(1,1,1,"path",1,0)
        const spy = jest.spyOn(require('../../repositories/ApplicationRepository.js').db,'run').mockImplementation((sql, params, callback) => {
            callback(new Error("some"), null);
        });
        const res = await request(app).put('/applications/1').send({status: 1}).set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
        expect(res.body).toEqual({ message: "some" })
        spy.mockRestore(); 
    });

    test("I9: thesisRepository.setStatus fails", async () => {
        await mgmt.insertIntoApplication(1,1,1,"path",1,0)
        require('../../repositories/ThesisRepository.js').setdb(
        {
            run: (sql, params, callback) =>{
                callback(new Error("aaa"));
            }
        });
        const res = await request(app).put('/applications/1').send({status: 1}).set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
        expect(res.body).toEqual({ message: "aaa" })
        require('../../repositories/ThesisRepository.js').restoredb;
    });

    test("I10: thesisRepository.setStatus no row updated", async () => {
        await mgmt.insertIntoApplication(1,1,1,"path",1,0)
        require('../../repositories/ThesisRepository.js').setdb({
            run:(sql, params, callback)=>{
                callback.call( {changes:0},null);
            }
        });
        const res = await request(app).put('/applications/1').send({status: 1}).set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
        expect(res.body).toEqual({message: "No rows updated. Thesis ID not found."}); 
        require('../../repositories/ThesisRepository.js').restoredb;
    });

})