const service = require('../../services/ThesisService.js');
const repository = require('../../repositories/ThesisRepository.js')
const coSupervisorThesisRepository = require('../../repositories/CoSupervisorThesisRepository.js')
const coSupervisorRepository = require('../../repositories/CoSupervisorRepository.js')
const teacherRepository = require('../../repositories/TeacherRepository.js')

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

    jest.mock('dayjs', () => {
        const originalDayjs = jest.requireActual('dayjs'); // Keep the original dayjs functions

        return jest.fn((dateString) => ({
            format: jest.fn(() => originalDayjs(dateString).format('YYYY-MM-DD')),
            toString: jest.fn(() => originalDayjs(dateString).toString()),
        }));
    });

    test('U1: adding a thesis with no cosupervisor', async () => {
        thesis.cosupervisor = [""]

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

        jest.spyOn(Promise, 'all').mockResolvedValue({error: 'error'})
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
        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {
            name: 'gigi',
            surname: 'verdi',
            email: 'gigiverdi@mail.com'
        }})
        jest.spyOn(repository, 'addThesis').mockResolvedValue({error: 'error'})
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
        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {
            name: 'gigi',
            surname: 'verdi',
            email: 'gigiverdi@mail.com'
        }})
        jest.spyOn(repository, 'addThesis').mockResolvedValue({error: 'error'})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return {error: 'error'}})

        try{
            await service.addThesis(thesis)
        }
        catch(error) {
            expect(error.error).toBe("error")
        }        
    })

    test('U6: adding a thesis with an internal cosupervisor and an external one', async () => {
        thesis.cosupervisor = ['gigiverdi@mail.com', 'gigirossi@mail.com']

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

    test('U7: adding a thesis with an two external cosupervisors', async () => {
        thesis.cosupervisor = ['gigiverdi@mail.com', 'gigirossi@mail.com']

        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {
            name: 'gigi',
            surname: 'verdi',
            email: 'gigiverdi@mail.com'
        }})
        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => { return{
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

    test('U8: adding a thesis with an two internal cosupervisors', async () => {
        thesis.cosupervisor = ['gigiverdi@mail.com', 'gigirossi@mail.com']
        
        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {}})
        jest.spyOn(teacherRepository, 'getByEmail').mockImplementationOnce(() => {return {
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

    test('U9: adding a thesis with an two internal cosupervisors but an error occurs in coSupervisorThesis repository', async () => {
        thesis.cosupervisor = ['gigiverdi@mail.com', 'gigirossi@mail.com']
        
        jest.spyOn(coSupervisorRepository, 'getByEmail').mockImplementationOnce(() => {return {}})
        jest.spyOn(teacherRepository, 'getByEmail').mockImplementationOnce(() => {return {
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
        jest.spyOn(repository, 'addThesis').mockResolvedValue({...thesis, id: 1})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return true})
        jest.spyOn(coSupervisorThesisRepository, 'addCoSupervisorThesis').mockImplementationOnce(() => {return {error: 'error'}})

        try{
            await service.addThesis(thesis)
        }
        catch(error) {
            expect(error.error).toBe("error")
        }        
    })
})
describe('supervisorCheck', ()=>{
    let supervisor;
    test('case0: missing supervisor', async () => {
        const res = await service.supervisorCheck(supervisor);
        expect(res).toEqual(null)
    });
    test('case1: ns.length>1 error', async () => {
        supervisor = "nome cognome";
        const spy = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockRejectedValue({ error: "error" })
        try {
            await service.supervisorCheck(supervisor);
        }
        catch (e) {
            expect(e).toStrictEqual({ error: "error" })
        }
        expect(spy).toHaveBeenCalledWith("cognome", "nome");
    });
    test('case2: ns.length==1 error', async () => {
        supervisor = "cognome";
        const spy = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockRejectedValue({ error: "error" })
        try {
            await service.supervisorCheck(supervisor);
        }
        catch (e) {
            expect(e).toStrictEqual({ error: "error" })
        }
        expect(spy).toHaveBeenCalledWith("cognome");
    });
    test('case3: success', async () => {
        const spy = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockResolvedValue([{ id: 0 }])
        const res = await service.supervisorCheck(supervisor);       
        expect(res).toEqual([0])
        expect(spy).toHaveBeenCalledWith("cognome");
    });
})

describe('coSupervisorCheck', ()=>{
    let coSupervisor;
    test('case2: coSupervisor missing', async () => {    
        const e = await service.coSupervisorCheck(coSupervisor);
        expect(e).toStrictEqual([])
    });
    test('case3: ns.length>1 error && teacherRepo.get... success', async () => {
        coSupervisor = ["nome cognome"]
        const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockRejectedValue({ error: "error" });
        try {
            await service.coSupervisorCheck(coSupervisor);
        }
        catch (e) {
            expect(e).toStrictEqual({ error: "error" })
        }
        expect(getByNSorSC).toHaveBeenCalledWith("cognome", "nome");
    });
    test('case4: ns.length==1 error ', async () => {
        coSupervisor = ["cognome"]
        const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockRejectedValue({ error: "error" });
        try {
            await service.coSupervisorCheck(coSupervisor);
        }
        catch (e) {
            expect(e).toStrictEqual({ error: "error" })
        }
        expect(getByNSorSC).toHaveBeenCalledWith("cognome");
    });
    test('case5: coSupervisor rep get success && getId... error ', async () => {
        const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockResolvedValue([{id:1}, {id:2}]);
        const getIdByCoSupervisorId = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'getIdByCoSupervisorId').mockRejectedValue({ error: "error" });
        try {
            await service.coSupervisorCheck(coSupervisor);
        }
        catch (e) {
            expect(e).toStrictEqual({ error: "error" })
        }
        expect(getByNSorSC).toHaveBeenCalledWith("cognome");
        expect(getIdByCoSupervisorId).toHaveBeenCalledWith([1, 2]);
    });
    test('case5: success', async () => {    
        const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockResolvedValue([{id:1}, {id:2}]);
        const getIdByCoSupervisorId = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'getIdByCoSupervisorId').mockResolvedValue(1);
        const e = await service.coSupervisorCheck(coSupervisor);
        expect(e).toStrictEqual([1])
        expect(getByNSorSC).toHaveBeenCalledWith("cognome");
        expect(getIdByCoSupervisorId).toHaveBeenCalledWith([1, 2]);
    });
})

describe('supervisorInfo', ()=>{
    test('case9: getById err ', async () => {
        const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockRejectedValue({ error: "error" });
        try {
            await service.supervisorInfo([{supervisor:1}]);
        } catch (e) {
            expect(e).toStrictEqual({ error: "error" });
        }
        expect(getById).toHaveBeenCalledWith(1);
    });
    test('case10: success ', async () => {
        const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockResolvedValue({ name: "name" });
        try {
            await service.supervisorInfo([{supervisor:1}]);
        } catch (e) {
            expect(e).toStrictEqual([{supervisor:{name:"name"}}]);
        }
        expect(getById).toHaveBeenCalledWith(1);
    });
})

describe('coSupervisorInfo', ()=>{
    test('case10: getIdsByThesisId err ', async () => {
        const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockRejectedValue({ error: "error" });
        try {
            await service.coSupervisorInfo([{id:1}]);
        } catch (e) {
            expect(e).toStrictEqual({ error: "error" });
        }
        expect(getIdsByThesisId).toHaveBeenCalledWith(1);
    });
    test('case11: coSupervisorRepository.getById err ', async () => {
        const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockResolvedValue([{ idCoSupervisor: 1 }]);
        const getByIdC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getById').mockRejectedValue({ error: "error" });
        try {
            await service.coSupervisorInfo([{id:1}]);
        } catch (e) {
            expect(e).toStrictEqual({ error: "error" });
        }
        expect(getIdsByThesisId).toHaveBeenCalledWith(1);
        expect(getByIdC).toHaveBeenCalledWith(1);
    });
    test('case12: teacherRepository.getById err ', async () => {
        const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockResolvedValue([{ idTeacher: 1 }]);
        const getByIdC = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockRejectedValue({ error: "error" });

        try {
            await service.coSupervisorInfo([{id:1}]);
        } catch (e) {
            expect(e).toStrictEqual({ error: "error" });
        }
        expect(getIdsByThesisId).toHaveBeenCalledWith(1);
        expect(getByIdC).toHaveBeenCalledWith(1);
    });
    test('case13: success ', async () => {
        const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockResolvedValue([{ idCoSupervisor: 1 }]);
        const getByIdC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getById').mockResolvedValue({ name: "name" });

        await service.coSupervisorInfo([{id:1}]);

        expect(getIdsByThesisId).toHaveBeenCalledWith(1);
        expect(getByIdC).toHaveBeenCalledWith(1);
    })
})

describe('updateThesis unit tests', () => {
    let thesis
    let thesisId

    beforeAll(() => {
        thesis = {
            supervisor: 1,
            title: "New thesis is added",
            keywords: ["SoftEng"],
            type: ["abroad"],
            groups: ["group1"],
            description: "new thesis description",
            knowledge: ["none"],
            note: "",
            expiration_date: '2024-10-10',
            level: "Master",
            cds: ["ingInf"],
            creation_date: '2023-12-07',
            status: 1
        }
        thesisId = 1
    })

    jest.mock('dayjs', () => {
        const originalDayjs = jest.requireActual('dayjs'); // Keep the original dayjs functions

        return jest.fn((dateString) => ({
            format: jest.fn(() => originalDayjs(dateString).format('YYYY-MM-DD')),
            toString: jest.fn(() => originalDayjs(dateString).toString()),
        }));
    });

    test('U1: updateThesis is done', async () => {
        jest.spyOn(repository, 'updateThesis').mockResolvedValue(1)
        const res = await service.updateThesis({...thesis, thesisId})
        expect(res).toBe(1)
    })

    test('U2: updateThesis is not done, no thesis ID found', async () => {
        thesisId = 31
        jest.spyOn(repository, 'updateThesis').mockImplementationOnce(() => {return {error: 'No rows updated. Thesis ID not found.'}})

        const res = await service.updateThesis({...thesis, thesisId})
        expect(res.error).toBe('No rows updated. Thesis ID not found.')
    })

    test('U3: updateThesis is not done, internal DB error', async () => {
        jest.spyOn(repository, 'updateThesis').mockImplementationOnce(() => {return {error: 'Internal DB error'}})

        const res = await service.updateThesis({...thesis, thesisId})
        expect(res.error).toBe('Internal DB error')
    })
})

describe('advancedResearchThesis', () => {
    let page = 1, order = 'titleD', title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level;

    test('case1: supervisorCheck err ', async () => {
        supervisor = "nameS"
        const spy = jest.spyOn(require('../../services/ThesisService.js'),'supervisorCheck').mockRejectedValue({error:"error"})
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(spy).toHaveBeenCalledWith('nameS')
            expect(e).toStrictEqual({ error: "error" });
        }
    });
    test('case1: coSupervisorCheck err ', async () => {
        coSupervisor = "nameC"
        const spysu = jest.spyOn(require('../../services/ThesisService.js'),'supervisorCheck').mockResolvedValue([1])
        const spyco = jest.spyOn(require('../../services/ThesisService.js'),'coSupervisorCheck').mockRejectedValue({error:"error"})
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(spysu).toHaveBeenCalledWith('nameS');
            expect(spyco).toHaveBeenCalledWith('nameC');
            expect(e).toStrictEqual({ error: "error" });
        }
    });
    test('case2: ok=false ', async () => {
        const spysu = jest.spyOn(require('../../services/ThesisService.js'),'supervisorCheck').mockResolvedValue()
        const spyco = jest.spyOn(require('../../services/ThesisService.js'),'coSupervisorCheck').mockResolvedValue([])
        
        const res = await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        expect(res).toStrictEqual([[],0])
        expect(spysu).toHaveBeenCalledWith('nameS');
        expect(spyco).toHaveBeenCalledWith('nameC');
        
    });
    test('case3: advancedResearch err ', async () => {
        const spysu = jest.spyOn(require('../../services/ThesisService.js'),'supervisorCheck').mockResolvedValue([1])
        const spyco = jest.spyOn(require('../../services/ThesisService.js'),'coSupervisorCheck').mockResolvedValue([1])
        const spyad = jest.spyOn(require('../../repositories/ThesisRepository.js'),'advancedResearch').mockRejectedValue({error:"error"})
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(spysu).toHaveBeenCalledWith('nameS');
            expect(spyco).toHaveBeenCalledWith('nameC');
            expect(spyad).toHaveBeenCalledWith(10*(page-1), 10*page, order, false, title, [1], [1], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(e).toStrictEqual({ error: "error" });
        }
        
    });
    test('case4: numberOfPage err ', async () => {
        const spysu = jest.spyOn(require('../../services/ThesisService.js'),'supervisorCheck').mockResolvedValue([1])
        const spyco = jest.spyOn(require('../../services/ThesisService.js'),'coSupervisorCheck').mockResolvedValue([1])
        const spyad = jest.spyOn(require('../../repositories/ThesisRepository.js'),'advancedResearch').mockResolvedValue([{id:1, supervisor:1, coSupervisor:[]}])
        const spynp = jest.spyOn(require('../../repositories/ThesisRepository.js'),'numberOfPage').mockRejectedValue({error:"error"})
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(spysu).toHaveBeenCalledWith('nameS');
        expect(spyco).toHaveBeenCalledWith('nameC');
        expect(spyad).toHaveBeenCalledWith(10*(page-1), 10*page, order, false,title, [1], [1], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        expect(spynp).toHaveBeenCalledWith( false, title, [1], [1], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(e).toStrictEqual({ error: "error" });
        }
    });
    test('case5: supervisorInfo err ', async () => {
        const spysu = jest.spyOn(require('../../services/ThesisService.js'),'supervisorCheck').mockResolvedValue([1])
        const spyco = jest.spyOn(require('../../services/ThesisService.js'),'coSupervisorCheck').mockResolvedValue([1])
        const spyad = jest.spyOn(require('../../repositories/ThesisRepository.js'),'advancedResearch').mockResolvedValue([{id:1, supervisor:1, coSupervisor:[]}])
        const spynp = jest.spyOn(require('../../repositories/ThesisRepository.js'),'numberOfPage').mockResolvedValue({nRows:1})
        const spysi = jest.spyOn(require('../../services/ThesisService.js'),'supervisorInfo').mockRejectedValue({error:"error"})
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(spysu).toHaveBeenCalledWith('nameS');
        expect(spyco).toHaveBeenCalledWith('nameC');
        expect(spyad).toHaveBeenCalledWith(10*(page-1), 10*page, order, false,title, [1], [1], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        expect(spynp).toHaveBeenCalledWith( false, title,[1], [1], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        expect(spysi).toHaveBeenCalledWith([{id:1, supervisor:1, coSupervisor:[]}]);
            expect(e).toStrictEqual({ error: "error" });
        }
    });  
    test('case6: coSupervisorCheck err ', async () => {
        
        const spysu = jest.spyOn(require('../../services/ThesisService.js'),'supervisorCheck').mockResolvedValue([1])
        const spyco = jest.spyOn(require('../../services/ThesisService.js'),'coSupervisorCheck').mockResolvedValue([1])
        const spyad = jest.spyOn(require('../../repositories/ThesisRepository.js'),'advancedResearch').mockResolvedValue([{id:1, supervisor:1, coSupervisor:[]}])
        const spynp = jest.spyOn(require('../../repositories/ThesisRepository.js'),'numberOfPage').mockResolvedValue({nRows:1})
        const spysi = jest.spyOn(require('../../services/ThesisService.js'),'supervisorInfo').mockResolvedValue()
        const spyci = jest.spyOn(require('../../services/ThesisService.js'),'coSupervisorInfo').mockRejectedValue({error:"error"})
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
            Promise.resolve();
        }
        catch(e){
            expect(spysu).toHaveBeenCalledWith('nameS');
            expect(spyco).toHaveBeenCalledWith('nameC');
            expect(spyad).toHaveBeenCalledWith(10*(page-1), 10*page, order, false,title, [1], [1], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(spynp).toHaveBeenCalledWith( false, title,[1], [1], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
            expect(spysi).toHaveBeenCalledWith([{id:1, supervisor:1, coSupervisor:[]}]);
            expect(spyci).toHaveBeenCalledWith([{id:1, supervisor:1, coSupervisor:[]}]);
            expect(e).toStrictEqual({ error: "error" });
        }
    });
    test('case7: succ ', async () => {
        const spysu = jest.spyOn(require('../../services/ThesisService.js'),'supervisorCheck').mockResolvedValue([1])
        const spyco = jest.spyOn(require('../../services/ThesisService.js'),'coSupervisorCheck').mockResolvedValue([2])
        const spyad = jest.spyOn(require('../../repositories/ThesisRepository.js'),'advancedResearch').mockResolvedValue([{id:1, supervisor:1, coSupervisor:[]}])
        const spynp = jest.spyOn(require('../../repositories/ThesisRepository.js'),'numberOfPage').mockResolvedValue({nRows:1})
        const spysi = jest.spyOn(require('../../services/ThesisService.js'),'supervisorInfo').mockResolvedValue()
        const spyci = jest.spyOn(require('../../services/ThesisService.js'),'coSupervisorInfo').mockResolvedValue()
        
        const res = await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        expect(res).toStrictEqual([[{id:1, supervisor:1, coSupervisor:[]}], 1])
        expect(spysu).toHaveBeenCalledWith('nameS');
        expect(spyco).toHaveBeenCalledWith('nameC');
        expect(spyad).toHaveBeenCalledWith(10*(page-1), 10*page, order, false,title, [1], [2], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        expect(spynp).toHaveBeenCalledWith( false, title,[1], [2], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        expect(spysi).toHaveBeenCalledWith([{id:1, supervisor:1, coSupervisor:[]}]);
        expect(spyci).toHaveBeenCalledWith([{id:1, supervisor:1, coSupervisor:[]}]);
    });    
});
