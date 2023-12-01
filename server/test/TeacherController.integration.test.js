const request = require("supertest");
const controller = require("../controllers/TeacherController.js");
let {app, login_as} = require('../index.js')
const mgmt = require('../mgmt_db.js');

describe("BROWSE PROPOSAL INTEGRATION TEST", () => {
    beforeEach( async () => {
        await mgmt.cleanThesis()
        await mgmt.cleanCoSupervisor()
        await mgmt.cleanTeacher()
        await mgmt.cleanCoSupervisorThesis()
        login_as.user = {
              id: 1,
              name: "Gianni",
              lastname: "Altobelli",
              role: 'teacher',
              nameID: "gianni.altobelli@email.it"
            }
    })

    afterAll( async () => {
        await mgmt.cleanThesis()
        await mgmt.cleanCoSupervisor()
        await mgmt.cleanTeacher()
        await mgmt.cleanCoSupervisorThesis()
    })

    test('I1: browse my thesis but there are none', async () => {
        await mgmt.insertIntoTeacher(1, "Gianni", "Altobelli", "gianni.altobelli@email.it", "group1", "dep1")

        await request(app)
                .get('/professor/thesis')
                .expect(200)
                .then(res => {
                    expect(res.body.length).toBe(0)
                })
    })

    test('I2: browse my thesis and there are some (all mine)', async () => {
        await mgmt.insertIntoTeacher(1, "Gianni", "Altobelli", "gianni.altobelli@email.it", "group1", "dep1")
        
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
            await mgmt.insertIntoThesis(i, title, thesis.supervisor, thesis.keywords, thesis.type, thesis.groups, thesis.description, 
                thesis.knowledge, thesis.note, thesis.expiration_date, thesis.level, thesis.cds, thesis.creation_date, thesis.status)
        }


        await request(app)
                .get('/professor/thesis')
                .expect(200)
                .then(res => {
                    expect(res.body.length).toBe(5)
                })
    })

    test('I2: browse my thesis and there are some (all mine)', async () => {
        await mgmt.insertIntoTeacher(1, "Gianni", "Altobelli", "gianni.altobelli@email.it", "group1", "dep1")

        await mgmt.insertIntoTeacher(2, "Aldo", "mar", "Aldo.mar@email.it", "group1", "dep1")
        
        
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
            await mgmt.insertIntoThesis(i, title, thesis.supervisor, thesis.keywords, thesis.type, thesis.groups, thesis.description, 
                thesis.knowledge, thesis.note, thesis.expiration_date, thesis.level, thesis.cds, thesis.creation_date, thesis.status)
        }


        await request(app)
                .get('/professor/thesis')
                .expect(200)
                .then(res => {
                    expect(res.body.length).toBe(5)
                })
    })
})