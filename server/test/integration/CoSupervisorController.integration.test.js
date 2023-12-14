const request = require("supertest");
let {app, login_as} = require('../../index.js')
const mgmt = require('./mgmt_db.js');

let server;
beforeAll(()=>{
    server = app.listen(3001)
})
afterAll((done) => {
    server.close(done);
});


afterEach( async () => {
    await mgmt.cleanCoSupervisorThesis()
});  

describe("getAllCoSupervisorsEmails TEST", () => {
    beforeEach( async () => {
        await mgmt.cleanCoSupervisorThesis()

        login_as.user = {
            id: 1,
            name: 'Gianni',
            lastname: 'Altobelli',
            nameID: 'gianni.altobelli@email.it',
            role: 'teacher',
            cds: 'Computer Science',
            cdsCode: 1,
            group: 'group1'
        }
    });

    afterEach( async () => {
        await mgmt.cleanThesis()
        await mgmt.cleanCoSupervisor()
        await mgmt.cleanTeacher()
        await mgmt.cleanCoSupervisorThesis()
    });
    test("I1: user role != teacher", async () => {
        login_as.user.role = "student";

        const res = await request(app).get('/cosupervisors/email');
        expect(res.body).toStrictEqual({message: "Only teacher can access to this API"})
        expect(res.status).toBe(401);

    });

    test("I2: getAllCoSupervisorsEmailsService fails", async () => {

        jest.mock("../../repositories/db.js");

        //await mgmt.insertIntoCoSupervisor(1, login_as.user.email, login_as.user.name, login_as.user.surname, 'Polito')
        const sqlite3 = require('sqlite3')
        const spyAll = jest.spyOn(sqlite3.Database.prototype, 'all');
        spyAll.mockImplementation((sql, params, callback) => {
            callback(new Error("some"), null);
        });
        const res = await request(app).get('/cosupervisors/email')
        expect(res.body).toStrictEqual({message: "Internal server error"})
        expect(res.status).toBe(500)
        spyAll.mockRestore();    
    });

    test("I3: success with no data", async () => {
        const res = await request(app).get('/cosupervisors/email')
        expect(res.body).toStrictEqual([])
        expect(res.status).toBe(200)
    });

    test("I4: success", async () => {
        await mgmt.insertIntoCoSupervisor(1, "a.b@email.it", "name", "surname", 'Polito')
        const res = await request(app).get('/cosupervisors/email')
        expect(res.body).toStrictEqual(["a.b@email.it"])
        expect(res.status).toBe(200)
    });
})