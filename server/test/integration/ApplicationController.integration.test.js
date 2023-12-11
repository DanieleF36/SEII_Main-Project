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