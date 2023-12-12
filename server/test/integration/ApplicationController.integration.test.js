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

let application, student,career;

afterEach(async () => {
    await mgmt.cleanApplication()
    await mgmt.cleanStudent()
});

describe("LIST APPLICATION INTEGRATION TEST", () => {
    beforeEach(async () => {
        await mgmt.cleanApplication()
        await mgmt.cleanStudent()
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
        await mgmt.cleanStudent()
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
        await mgmt.insertIntoStudent(1, student.surname, student.name, student.gender, student.nationality, student.email, student.cod_degree, student.enrol_year)
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
        await mgmt.insertIntoStudent(1, student.surname, student.name, student.gender, student.nationality, student.email, student.cod_degree, student.enrol_year)
        const response = await request(app).get('/applications')
        expect(response.status).toBe(200)
    })
})

describe("GET CAREER CV INTEGRATION TEST", () => {
    beforeEach(async () => {
        await mgmt.cleanStudent()
        await mgmt.cleanCareer()
        login_as.user = {
            id: 1,
            name: 'Gianni',
            lastname: 'Altobelli',
            nameID: 'gianni.altobelli@email.it',
            role: 'teacher',
            group: 'group1'
        }

        student = {
            id: 1,
            name: "Giuseppe",
            surname: "Sculli",
            gender: "male",
            email: "sculli@mail.com",
            cod_degree: 1,
            enrol_year: 2010,
            nationality: "italian"
        }
        career = {
            id:1,
            cod_course: 1,
            title_course : "Grosso_corso",
            cfu : 10,
            grade : 30,
            date : "2023-01-01"
        }
    })

    afterAll(async () => {
        await mgmt.cleanApplication()
        await mgmt.cleanStudent()
        await mgmt.cleanCareer()
    })

    test("I1: You can not access to this route", async () => {
        login_as.user.role = "wrong role"
        const response = await request(app).get('/applications/career/1')
        expect(response.status).toBe(401)
    })
    test("I2: Missing id student or negative", async () => {
        const response = await request(app).get('/applications/career/-1')
        expect(response.status).toBe(400)
    })
    test("I3: Student with no exam in his career", async () => {
        await mgmt.insertIntoStudent(1, student.surname, student.name, student.gender, student.nationality, student.email, student.cod_degree, student.enrol_year)
        await mgmt.insertIntoCareer(1, student.id, career.cod_course, career.title_course, career.cfu, career.grade, career.date)
        const response = await request(app).get('/applications/career/2')
        expect(response.status).toBe(200)
    })
    test("I4: getCareer done and an exam info returned", async () => {
        await mgmt.insertIntoStudent(1, student.surname, student.name, student.gender, student.nationality, student.email, student.cod_degree, student.enrol_year)
        await mgmt.insertIntoCareer(1, student.id, career.cod_course, career.title_course, career.cfu, career.grade, career.date)
        const response = await request(app).get('/applications/career/1')
        expect(response.status).toBe(200)
    })
})