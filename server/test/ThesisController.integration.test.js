const request = require("supertest");
const controller = require("../controllers/ThesisController");
let {app, login_as} = require('../index.js')
const mgmt = require('../mgmt_db.js');
const dayjs = require('dayjs')

describe("INSERT PROPOSAL INTEGRATION TEST", () => {
    beforeEach( async () => {
        await mgmt.cleanThesis()
        await mgmt.cleanCoSupervisor()
        await mgmt.cleanTeacher()
        await mgmt.cleanCoSupervisorThesis()
        login_as.user = {
            id: 1,
            name: 'Gianni',
            lastname: 'Altobelli',
            nameID: 'gianni.altobelli@email.it',
            role: 'teacher'
        }
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
            groups: ["group1"],
            description: "new thesis description",
            knowledge: ["none"],
            note: "",
            expiration_date: "2024-01-01",
            level: "Master",
            cds: ["ingInf"],
            status: 1
        }

        const expected_thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: "SoftEng",
            type: "abroad",
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-01",
            level: 1,
            cds: "ingInf",
            status: 1,
            creation_date: dayjs().format('YYYY-MM-DD').toString()
        }
        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(200)
                .then( resp => {
                    expect(resp.text).toEqual(JSON.stringify(expected_thesis))
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
            groups: ["group1"],
            description: "new thesis description",
            knowledge: ["none"],
            note: "",
            expiration_date: "2024-01-01",
            level: "Master",
            cds: ["ingInf"],
            status: 1
        }

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
            groups: ["group1"],
            description: "new thesis description",
            knowledge: ["none"],
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: ["ingInf"],
            status: 1
        }

        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)

    })

    test("I4: insert a thesis, keywords are not array", async () => {
        await mgmt.insertIntoTeacher(1, "Rossi", "Mario", "asd@mail.com", "group1", "dep1")
        await mgmt.insertIntoCoSupervisor(1, "gigiverdi@mail.com", "Gigi", "Verdi", "Fake SRL")

        const thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: "SoftEng",
            type: ["abroad"],
            groups: ["group1"],
            description: "new thesis description",
            knowledge: ["none"],
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: ["ingInf"],
            status: 1
        }

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
            groups: ["group1"],
            description: "new thesis description",
            knowledge: ["none"],
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: ["ingInf"],
            status: 1
        }

        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)
    })

    test("I6: insert a thesis, type is not array", async () => {
        await mgmt.insertIntoTeacher(1, "Rossi", "Mario", "asd@mail.com", "group1", "dep1")
        await mgmt.insertIntoCoSupervisor(1, "gigiverdi@mail.com", "Gigi", "Verdi", "Fake SRL")

        const thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: ["SoftEng"],
            type: "abroad",
            groups: ["group1"],
            description: "new thesis description",
            knowledge: ["none"],
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: ["ingInf"],
            status: 1
        }

        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)
    })

    test("I7: insert a thesis, groups is not array", async () => {
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
            knowledge: ["none"],
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: ["ingInf"],
            status: 1
        }

        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)
    })

    test("I8: insert a thesis, knowledge is not array", async () => {
        await mgmt.insertIntoTeacher(1, "Rossi", "Mario", "asd@mail.com", "group1", "dep1")
        await mgmt.insertIntoCoSupervisor(1, "gigiverdi@mail.com", "Gigi", "Verdi", "Fake SRL")

        const thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: ["SoftEng"],
            type: ["abroad"],
            groups: ["group1"],
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: ["ingInf"],
            status: 1
        }

        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)
    })

    test("I9: insert a thesis, cds is not array", async () => {
        await mgmt.insertIntoTeacher(1, "Rossi", "Mario", "asd@mail.com", "group1", "dep1")
        await mgmt.insertIntoCoSupervisor(1, "gigiverdi@mail.com", "Gigi", "Verdi", "Fake SRL")

        const thesis = {
            title: "New thesis is added",
            supervisor: 1,
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: ["SoftEng"],
            type: ["abroad"],
            groups: ["group1"],
            description: "new thesis description",
            knowledge: ["none"],
            note: "",
            expiration_date: undefined,
            level: "Master",
            cds: "ingInf",
            status: 1
        }

        await request(app)
                .post('/thesis')
                .send(thesis)
                .expect(400)
    })
})


describe("SEARCH PROPOSAL INTEGRATION TEST", () => {
    beforeEach( async () => {
        await mgmt.cleanThesis()
        await mgmt.cleanCoSupervisor()
        await mgmt.cleanTeacher()
        await mgmt.cleanCoSupervisorThesis()
        login_as.user = {
            id: 1,
            name: 'Gianni',
            lastname: 'Altobelli',
            nameID: 'gianni.altobelli@email.it',
            role: 'student',
            cds: 'ingInf'
        }
    })
    test("I1: get thesis from page 1", async () => {
        let i
        const no_thesis = 5
        const thesis = {
            supervisor: 1,
            keywords: "SoftEng",
            type: "abroad",
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-01",
            level: 1,
            cds: "ingInf",
            status: 1,
            creation_date: "2023-01-01"
        }

        for(i = 0; i < no_thesis; i++){
            let title = `title ${i}`
            let result = await mgmt.insertIntoThesis(i, title, thesis.supervisor, thesis.keywords, thesis.type, thesis.groups, thesis.description, 
                thesis.knowledge, thesis.note, thesis.expiration_date, thesis.level, thesis.cds, thesis.creation_date, thesis.status)
        }

        await request(app)
                .get('/thesis?page=1')
                .expect(200)
                .then( resp => {
                    expect(resp.body.nPage).toEqual(1)
                    expect(resp.body.thesis.length).toEqual(no_thesis)
                })

    })

    test("I2: get thesis from page 2", async () => {
        let i
        const no_thesis = 11
        const thesis = {
            supervisor: 1,
            keywords: "SoftEng",
            type: "abroad",
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-01",
            level: 1,
            cds: "ingInf",
            status: 1,
            creation_date: "2023-01-01"
        }

        for(i = 0; i < no_thesis; i++){
            let title = `title ${i}`
            await mgmt.insertIntoThesis(i, title, thesis.supervisor, thesis.keywords, thesis.type, thesis.groups, thesis.description, 
                thesis.knowledge, thesis.note, thesis.expiration_date, thesis.level, thesis.cds, thesis.creation_date, thesis.status)
        }

        await request(app)
                .get('/thesis?page=2')
                .expect(200)
                .then( resp => {
                    expect(resp.body.nPage).toEqual(2)
                    expect(resp.body.thesis.length).toEqual(1)
                })

    })

    test("I3: get thesis with a given title", async () => {
        let i
        const no_thesis = 11
        const thesis = {
            title: 'myTitle',
            supervisor: 1,
            keywords: "SoftEng",
            type: "abroad",
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-01",
            level: 1,
            cds: "ingInf",
            status: 1,
            creation_date: "2023-01-01"
        }


        await mgmt.insertIntoThesis(0, thesis.title, thesis.supervisor, thesis.keywords, thesis.type, thesis.groups, thesis.description, 
            thesis.knowledge, thesis.note, thesis.expiration_date, thesis.level, thesis.cds, thesis.creation_date, thesis.status)


        await request(app)
                .get('/thesis?page=1&title=my')
                .expect(200)
                .then( resp => {
                    expect(resp.body.nPage).toEqual(1)
                    expect(resp.body.thesis.length).toEqual(1)
                    expect(resp.body.thesis[0].title).toEqual(thesis.title)
                })

    })

    test("I4: get thesis with a given keyword", async () => {
        let i
        const no_thesis = 11
        const thesis = {
            title: 'myTitle',
            supervisor: 1,
            keywords: "SoftEng",
            type: "abroad",
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-0title1",
            level: 1,
            cds: "ingInf",
            status: 1,
            creation_date: "2023-01-01"
        }


        await mgmt.insertIntoThesis(0, thesis.title, thesis.supervisor, thesis.keywords, thesis.type, thesis.groups, thesis.description, 
            thesis.knowledge, thesis.note, thesis.expiration_date, thesis.level, thesis.cds, thesis.creation_date, thesis.status)


        await request(app)
                .get('/thesis?page=1&keyword=soft')
                .expect(200)
                .then( resp => {
                    expect(resp.body.nPage).toEqual(1)
                    expect(resp.body.thesis.length).toEqual(1)
                    expect(resp.body.thesis[0].keywords).toEqual(thesis.keywords)
                })

    })

    test("I5: get thesis with a given type", async () => {
        let i
        const no_thesis = 11
        const thesis = {
            title: 'myTitle',
            supervisor: 1,
            keywords: "SoftEng",
            type: "abroad",
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-0title1",
            level: 1,
            cds: "ingInf",
            status: 1,
            creation_date: "2023-01-01"
        }


        await mgmt.insertIntoThesis(0, thesis.title, thesis.supervisor, thesis.keywords, thesis.type, thesis.groups, thesis.description, 
            thesis.knowledge, thesis.note, thesis.expiration_date, thesis.level, thesis.cds, thesis.creation_date, thesis.status)


        await request(app)
                .get('/thesis?page=1&type=abroad')
                .expect(200)
                .then( resp => {
                    expect(resp.body.nPage).toEqual(1)
                    expect(resp.body.thesis.length).toEqual(1)
                    expect(resp.body.thesis[0].type).toEqual(thesis.type)
                })

    })

    test("I6: get thesis with a given group", async () => {
        let i
        const no_thesis = 11
        const thesis = {
            title: 'myTitle',
            supervisor: 1,
            keywords: "SoftEng",
            type: "abroad",
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-0title1",
            level: 1,
            cds: "ingInf",
            status: 1,
            creation_date: "2023-01-01"
        }


        await mgmt.insertIntoThesis(0, thesis.title, thesis.supervisor, thesis.keywords, thesis.type, thesis.groups, thesis.description, 
            thesis.knowledge, thesis.note, thesis.expiration_date, thesis.level, thesis.cds, thesis.creation_date, thesis.status)


        await request(app)
                .get('/thesis?page=1&group=group')
                .expect(200)
                .then( resp => {
                    expect(resp.body.nPage).toEqual(1)
                    expect(resp.body.thesis.length).toEqual(1)
                    expect(resp.body.thesis[0].group).toEqual(thesis.group)
                })

    })

    test("I7: get thesis with a given knowledge with entries", async () => {
        let i
        const no_thesis = 11
        const thesis = {
            title: 'myTitle',
            supervisor: 1,
            keywords: "SoftEng",
            type: "abroad",
            groups: "group1",
            description: "new thesis description",
            knowledge: "none",
            note: "",
            expiration_date: "2024-01-0title1",
            level: 1,
            cds: "ingInf",
            status: 1,
            creation_date: "2023-01-01"
        }


        await mgmt.insertIntoThesis(0, thesis.title, thesis.supervisor, thesis.keywords, thesis.type, thesis.groups, thesis.description, 
            thesis.knowledge, thesis.note, thesis.expiration_date, thesis.level, thesis.cds, thesis.creation_date, thesis.status)


        await request(app)
                .get('/thesis?page=1&knowledge=progr')
                .expect(200)
                .then( resp => {
                    expect(resp.body.nPage).toEqual(0)
                    expect(resp.body.thesis.length).toEqual(0)
                })

    })


})


// describe("", () => {
//     test('I1: get all cosupervisor emails but there are none')

// })