const service = require('../../services/ThesisService.js');
const repository = require('../../repositories/ThesisRepository.js')
const coSupervisorThesisRepository = require('../../repositories/CoSupervisorThesisRepository.js')
const coSupervisorRepository = require('../../repositories/CoSupervisorRepository.js')
const teacherRepository = require('../../repositories/TeacherRepository.js')
const dayjs = require('dayjs')

describe('addThesis unit tests', () => {
    let thesis
    beforeAll(() => {
        thesis = {
            supervisor: 1,
            title: "New thesis is added",
            cosupervisor: ["gigiverdi@mail.com"],
            keywords: ["SoftEng"],
            type: ["abroad"],
            groups: ["group1"],
            description: "new thesis description",
            knowledge: ["none"],
            note: "",
            expiration_date: '2024-10-10',
            level: "Master",
            cds: ["ingInf"],
            status: 1
        }
    })
    test('U1: adding a thesis with no cosupervisor', async () => {
        thesis.cosupervisor = [""]

        jest.mock('dayjs', () => {
            const originalDayjs = jest.requireActual('dayjs'); // Keep the original dayjs functions

            return jest.fn((dateString) => ({
                format: jest.fn(() => originalDayjs(dateString).format('YYYY-MM-DD')),
                toString: jest.fn(() => originalDayjs(dateString).toString()),
            }));
        });

        const res = jest.spyOn(repository, 'addThesis').mockResolvedValue({...thesis, id: 1})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})

        await service.addThesis(thesis)
        expect(res).toHaveBeenCalledWith(...Object.values(res.mock.calls[0]))
    })

    test('U2: adding a thesis with a not found cosupervisor', async () => {
        thesis.cosupervisor = ["notfound@email.com"]

        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {}})
        jest.spyOn(teacherRepository, 'getByEmail').mockImplementationOnce(() => {return {}})
        
        try{
            await service.addThesis(thesis)
        }
        catch(error) {
            expect(error.status).toBe(400)
            expect(error.error).toBeDefined()
        }
    })

    test('U3: adding a thesis but an error in repository occurs', async () => {
        thesis.cosupervisor = [""]

        jest.mock('dayjs', () => {
            const originalDayjs = jest.requireActual('dayjs'); // Keep the original dayjs functions

            return jest.fn((dateString) => ({
                format: jest.fn(() => originalDayjs(dateString).format('YYYY-MM-DD')),
                toString: jest.fn(() => originalDayjs(dateString).toString()),
            }));
        });

        const res = jest.spyOn(repository, 'addThesis').mockResolvedValue({error: 'error'})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})

        try{
            await service.addThesis(thesis)
        }
        catch(error) {
            expect(error.status).toBe(500)
            expect(error.error).toBeDefined()
        }
    })

    test('U4: adding a thesis but an error in coSupervisorThesis repository occurs', async () => {
        jest.mock('dayjs', () => {
            const originalDayjs = jest.requireActual('dayjs'); // Keep the original dayjs functions

            return jest.fn((dateString) => ({
                format: jest.fn(() => originalDayjs(dateString).format('YYYY-MM-DD')),
                toString: jest.fn(() => originalDayjs(dateString).toString()),
            }));
        });

        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {
            name: 'gigi',
            surname: 'verdi',
            email: 'gigiverdi@mail.com'
        }})
        const res = jest.spyOn(repository, 'addThesis').mockResolvedValue({error: 'error'})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return {error: 'error'}})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})

        try{
            await service.addThesis(thesis)
        }
        catch(error) {
            expect(error.error).toBe('error')
        }
    })

    test('U5: adding a thesis but an another error in coSupervisorThesis repository occurs', async () => {
        jest.mock('dayjs', () => {
            const originalDayjs = jest.requireActual('dayjs'); // Keep the original dayjs functions

            return jest.fn((dateString) => ({
                format: jest.fn(() => originalDayjs(dateString).format('YYYY-MM-DD')),
                toString: jest.fn(() => originalDayjs(dateString).toString()),
            }));
        });

        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {
            name: 'gigi',
            surname: 'verdi',
            email: 'gigiverdi@mail.com'
        }})
        const res = jest.spyOn(repository, 'addThesis').mockResolvedValue({error: 'error'})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return {error: 'error'}})

        try{
            await service.addThesis(thesis)
        }
        catch(error) {
            expect(error.error).toBe("error")
        }        
    })

    test('U5: adding a thesis with an internal cosupervisor and an external one', async () => {
        thesis.cosupervisor = ['gigiverdi@mail.com', 'gigirossi@mail.com']
        jest.mock('dayjs', () => {
            const originalDayjs = jest.requireActual('dayjs'); // Keep the original dayjs functions

            return jest.fn((dateString) => ({
                format: jest.fn(() => originalDayjs(dateString).format('YYYY-MM-DD')),
                toString: jest.fn(() => originalDayjs(dateString).toString()),
            }));
        });

        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {
            name: 'gigi',
            surname: 'verdi',
            email: 'gigiverdi@mail.com'
        }})
        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {}})
        jest.spyOn(teacherRepository, 'getByEmail').mockImplementationOnce(() => { return{
            name: 'gigi',
            surname: 'rossi',
            email: 'gigirossi@mail.com'
        }})
        const res = jest.spyOn(repository, 'addThesis').mockResolvedValue({...thesis, id: 1})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})

        await service.addThesis(thesis)
        expect(res).toHaveBeenCalledWith(...Object.values(res.mock.calls[0]))    
    })
})

describe('advancedResearchThesis', () => {
    let page = 1, order = 'titleD', title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level;
    test('case1: ns.length>1 error', async () => {
        supervisor = "nome cognome";
        const spy = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockRejectedValue({ error: "error" })
        try {
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch (e) {
            expect(e).toStrictEqual({ error: "error" })
        }
        expect(spy).toHaveBeenCalledWith("cognome", "nome");
    }),
        test('case2: ns.length==1 error', async () => {
            supervisor = "cognome";
            const spy = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockRejectedValue({ error: "error" })
            try {
                await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
            }
            catch (e) {
                expect(e).toStrictEqual({ error: "error" })
            }
            expect(spy).toHaveBeenCalledWith("cognome");
        }),
        test('case3: ns.length>1 error && teacherRepo.get... success', async () => {
            coSupervisor = ["nome cognome"]
            const getByNSorST = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockRejectedValue({ error: "error" });
            try {
                await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
            }
            catch (e) {
                expect(e).toStrictEqual({ error: "error" })
            }
            expect(getByNSorST).toHaveBeenCalledWith("cognome");
            expect(getByNSorSC).toHaveBeenCalledWith("cognome", "nome");
        }),
        test('case4: ns.length==1 error ', async () => {
            coSupervisor = ["cognome"]
            const getByNSorST = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockRejectedValue({ error: "error" });
            try {
                await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
            }
            catch (e) {
                expect(e).toStrictEqual({ error: "error" })
            }
            expect(getByNSorST).toHaveBeenCalledWith("cognome");
            expect(getByNSorSC).toHaveBeenCalledWith("cognome");
        }),
        test('case5: coSupervisor rep get success && getId... error ', async () => {
            const getByNSorST = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockResolvedValue([1, 2]);
            const getIdByCoSupervisorId = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'getIdByCoSupervisorId').mockRejectedValue({ error: "error" });
            try {
                await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
            }
            catch (e) {
                expect(e).toStrictEqual({ error: "error" })
            }
            expect(getByNSorST).toHaveBeenCalledWith("cognome");
            expect(getByNSorSC).toHaveBeenCalledWith("cognome");
            expect(getIdByCoSupervisorId).toHaveBeenCalledWith([1, 2]);
        }),
        test('case6: ok = flase ', async () => {
            coSupervisor = null;
            const getByNSorST = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockResolvedValue([]);
            expect(service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)).resolves.toStrictEqual([[], 0]);
            expect(getByNSorST).toHaveBeenCalledWith("cognome");
        }),
        test('case7: advancedResearch error ', async () => {
            supervisor = undefined;
            title = "title";
            const spy = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockRejectedValue({ error: "error" });
            try {
                await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            } catch (e) {
                expect(e).toStrictEqual({ error: "error" });
            }
            expect(spy).toHaveBeenCalledWith(10 * (page - 1), 10 * page, 'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        }),
        test('case8: npage error ', async () => {
            const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{ id: 1, supervisor: 1 }]);
            const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockRejectedValue({ error: "error" });
            try {
                await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            } catch (e) {
                expect(e).toStrictEqual({ error: "error" });
            }
            expect(advancedResearch).toHaveBeenCalledWith(10 * (page - 1), 10 * page, 'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(nPage).toHaveBeenCalledWith(false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        }),
        test('case9: getById err ', async () => {
            const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{ id: 1, supervisor: 1 }]);
            const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockResolvedValue(1);
            const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockRejectedValue({ error: "error" });
            try {
                await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            } catch (e) {
                expect(e).toStrictEqual({ error: "error" });
            }
            expect(advancedResearch).toHaveBeenCalledWith(10 * (page - 1), 10 * page, 'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(nPage).toHaveBeenCalledWith(false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(getById).toHaveBeenCalledWith(1);
        }),
        test('case10: getIdsByThesisId err ', async () => {
            const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{ id: 1, supervisor: 1 }]);
            const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockResolvedValue(1);
            const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockResolvedValue({ name: "name" });
            const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockRejectedValue({ error: "error" });
            try {
                await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            } catch (e) {
                expect(e).toStrictEqual({ error: "error" });
            }
            expect(advancedResearch).toHaveBeenCalledWith(10 * (page - 1), 10 * page, 'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(nPage).toHaveBeenCalledWith(false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(getById).toHaveBeenCalledWith(1);
            expect(getIdsByThesisId).toHaveBeenCalledWith(1);
        }),
        test('case11: coSupervisorRepository.getById err ', async () => {
            const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{ id: 1, supervisor: 1, coSupervisors: [] }]);
            const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockResolvedValue(1);
            const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockResolvedValue({ name: "name" });
            const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockResolvedValue([{ idCoSupervisor: 1 }]);
            const getByIdC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getById').mockRejectedValue({ error: "error" });
            try {
                await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            } catch (e) {
                expect(e).toStrictEqual({ error: "error" });
            }
            expect(advancedResearch).toHaveBeenCalledWith(10 * (page - 1), 10 * page, 'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(nPage).toHaveBeenCalledWith(false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(getById).toHaveBeenCalledWith(1);
            expect(getIdsByThesisId).toHaveBeenCalledWith(1);
            expect(getByIdC).toHaveBeenCalledWith(1);
        }),
        test('case12: getIdsByThesisId err ', async () => {
            const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{ id: 1, supervisor: 1, coSupervisor: [] }]);
            const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockResolvedValue({ nRows: 1 });
            const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockResolvedValue({ name: "name" });
            const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockResolvedValue([{ idCoSupervisor: 1 }, { idTeacher: 1 }]);
            const getByIdC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getById').mockResolvedValue({ name: "coSUpervisor" });

            expect(service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)).resolves
                .toStrictEqual([[{ id: 1, supervisor: { name: "name" }, coSupervisor: [{ name: "coSUpervisor" }, { email: undefined, name: "name", surname: undefined, company: "PoliTo" }] }], 1]);

            expect(advancedResearch).toHaveBeenCalledWith(10 * (page - 1), 10 * page, 'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(nPage).toHaveBeenCalledWith(false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(getById).toHaveBeenCalledWith(1);
            expect(getIdsByThesisId).toHaveBeenCalledWith(1);
            expect(getByIdC).toHaveBeenCalledWith(1);
        })
});