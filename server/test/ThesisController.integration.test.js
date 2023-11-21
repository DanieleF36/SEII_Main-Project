const request = require("supertest");
const controller = require("../controllers/ThesisController");
const app = require('../index.js')
const mgmt = require('../mgmt_db.js');
const dayjs = require("dayjs");

describe("INSERT PROPOSAL UNIT TEST", () => {

    beforeEach( async () => {
        await mgmt.cleanThesis()
        await mgmt.cleanCoSupervisor()
        await mgmt.cleanTeacher()
        await mgmt.cleanCoSupervisorThesis()
    })

    afterAll( async () => {
        await mgmt.cleanThesis()
        await mgmt.cleanCoSupervisor()
        await mgmt.cleanTeacher()
        await mgmt.cleanCoSupervisorThesis()
    })

    test("I1: insert a thesis", async () => {

        await mgmt.insertIntoTeacher(1, "Rossi", "Mario", "mariorossi@mail.com", "group1", "dep1")
        await mgmt.insertIntoCoSupervisor(1, "gigiverdi@mail.com", "Gigi", "Verdi", "Fake SRL")

        const thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: ["SoftEng"],
            type: ["abroad"],
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-01",
            level: "Master",
            cds: "ingInf",
            status: 1
        }

        thesis.creation_date = dayjs().format('YYYY-MM-DD').toString()
        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(200)
                .then( resp => {
                    expect(resp.text).toEqual(JSON.stringify({...thesis, level: 1, keywords: "SoftEng", type: "abroad"}))
                })
    })

    test("I2: insert a thesis, a cosupervisor is missing so 500 error is returned", async () => {

        await mgmt.insertIntoTeacher(1, "Rossi", "Mario", "asd@mail.com", "group1", "dep1")
        // await mgmt.insertIntoCoSupervisor(1, "gigiverdi@mail.com", "Gigi", "Verdi", "Fake SRL")

        const thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: ["SoftEng"],
            type: ["abroad"],
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-01",
            level: "Master",
            cds: "ingInf",
            status: 1
        }

        thesis.creation_date = dayjs().format('YYYY-MM-DD').toString()
        // thesis.supervisor = 't123456' //temporary value to be removed
        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)

    })

    test("I3: insert a thesis, expiration date is not defined so 400 error is returned", async () => {

        await mgmt.insertIntoTeacher(1, "Rossi", "Mario", "asd@mail.com", "group1", "dep1")
        await mgmt.insertIntoCoSupervisor(1, "gigiverdi@mail.com", "Gigi", "Verdi", "Fake SRL")

        const thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: ["SoftEng"],
            type: ["abroad"],
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: "ingInf",
            status: 1
        }

        thesis.creation_date = dayjs().format('YYYY-MM-DD').toString()
        // thesis.supervisor = 't123456' //temporary value to be removed
        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)

    })

    test("I4: insert a thesis, keywords and/or types are not array", async () => {
        await mgmt.insertIntoTeacher(1, "Rossi", "Mario", "asd@mail.com", "group1", "dep1")
        await mgmt.insertIntoCoSupervisor(1, "gigiverdi@mail.com", "Gigi", "Verdi", "Fake SRL")

        const thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: "SoftEng",
            type: "abroad",
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: "ingInf",
            status: 1
        }

        thesis.creation_date = dayjs().format('YYYY-MM-DD').toString()
        // thesis.supervisor = 't123456' //temporary value to be removed
        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)
    })

    test("I5: insert a thesis, cosupervisor is not an array (even an empty one)", async () => {
        await mgmt.insertIntoTeacher(1, "Rossi", "Mario", "asd@mail.com", "group1", "dep1")
        await mgmt.insertIntoCoSupervisor(1, "gigiverdi@mail.com", "Gigi", "Verdi", "Fake SRL")

        const thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: "gigiverdi@mail.com",
            keywords: ["SoftEng"],
            type: ["abroad"],
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: "ingInf",
            status: 1
        }

        thesis.creation_date = dayjs().format('YYYY-MM-DD').toString()
        // thesis.supervisor = 't123456' //temporary value to be removed
        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)
    })
})