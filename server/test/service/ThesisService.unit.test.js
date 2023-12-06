const service = require('../../services/ThesisService.js');

describe('advancedResearchThesis', ()=>{
    let page=1, order='titleD', title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level;
    test('case1: ns.length>1 error', async()=>{
        supervisor = "nome cognome";
        const spy = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockRejectedValue({error: "error"})
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(e).toStrictEqual({error: "error"})
        }
        expect(spy).toHaveBeenCalledWith("cognome", "nome");        
    }),
    test('case2: ns.length==1 error', async()=>{
        supervisor = "cognome";
        const spy = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockRejectedValue({error: "error"})
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(e).toStrictEqual({error: "error"})
        }
        expect(spy).toHaveBeenCalledWith("cognome");        
    }),
    test('case3: ns.length>1 error && teacherRepo.get... success', async()=>{
        coSupervisor = ["nome cognome"]
        const getByNSorST = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockResolvedValue([{id: 1}, {id: 2}]);
        const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockRejectedValue({error: "error"});
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(e).toStrictEqual({error: "error"})
        }
        expect(getByNSorST).toHaveBeenCalledWith("cognome"); 
        expect(getByNSorSC).toHaveBeenCalledWith("cognome", "nome");        
    }),
    test('case4: ns.length==1 error ', async()=>{
        coSupervisor = ["cognome"]
        const getByNSorST = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockResolvedValue([{id: 1}, {id: 2}]);
        const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockRejectedValue({error: "error"});
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(e).toStrictEqual({error: "error"})
        }
        expect(getByNSorST).toHaveBeenCalledWith("cognome"); 
        expect(getByNSorSC).toHaveBeenCalledWith("cognome");        
    }),
    test('case5: coSupervisor rep get success && getId... error ', async()=>{
        const getByNSorST = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockResolvedValue([{id: 1}, {id: 2}]);
        const getByNSorSC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getByNSorS').mockResolvedValue([1, 2]);
        const getIdByCoSupervisorId = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'getIdByCoSupervisorId').mockRejectedValue({error: "error"});
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)
        }
        catch(e){
            expect(e).toStrictEqual({error: "error"})
        }
        expect(getByNSorST).toHaveBeenCalledWith("cognome"); 
        expect(getByNSorSC).toHaveBeenCalledWith("cognome"); 
        expect(getIdByCoSupervisorId).toHaveBeenCalledWith([1,2]);       
    }),
    test('case6: ok = flase ', async()=>{
        coSupervisor = null;
        const getByNSorST = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getByNSorS').mockResolvedValue([]);
        expect(service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)).resolves.toStrictEqual([[],0]);
        expect(getByNSorST).toHaveBeenCalledWith("cognome"); 
    }),
    test('case7: advancedResearch error ', async()=>{
        supervisor = undefined;
        title = "title";
        const spy = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockRejectedValue({error:"error"});
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        }catch(e){
            expect(e).toStrictEqual({error:"error"});
        }
        expect(spy).toHaveBeenCalledWith(10*(page -1), 10*page,'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
    }),
    test('case8: npage error ', async()=>{
        const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{id:1, supervisor:1}]);
        const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockRejectedValue({error:"error"});
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        }catch(e){
            expect(e).toStrictEqual({error:"error"});
        }
        expect(advancedResearch).toHaveBeenCalledWith(10*(page -1), 10*page,'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
        expect(nPage).toHaveBeenCalledWith( false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
    }),
    test('case9: getById err ', async()=>{
        const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{id:1, supervisor:1}]);
        const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockResolvedValue(1);
        const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockRejectedValue({error:"error"});
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        }catch(e){
            expect(e).toStrictEqual({error:"error"});
        }
        expect(advancedResearch).toHaveBeenCalledWith(10*(page -1), 10*page,'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
        expect(nPage).toHaveBeenCalledWith( false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
        expect(getById).toHaveBeenCalledWith(1); 
    }),
    test('case10: getIdsByThesisId err ', async()=>{
        const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{id:1, supervisor:1}]);
        const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockResolvedValue(1);
        const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockResolvedValue({name:"name"});
        const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockRejectedValue({error:"error"});
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        }catch(e){
            expect(e).toStrictEqual({error:"error"});
        }
        expect(advancedResearch).toHaveBeenCalledWith(10*(page -1), 10*page,'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
        expect(nPage).toHaveBeenCalledWith( false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
        expect(getById).toHaveBeenCalledWith(1); 
        expect(getIdsByThesisId).toHaveBeenCalledWith(1); 
    }),
    test('case11: coSupervisorRepository.getById err ', async()=>{
        const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{id:1, supervisor:1, coSupervisors:[]}]);
        const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockResolvedValue(1);
        const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockResolvedValue({name:"name"});
        const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockResolvedValue([{idCoSupervisor:1}]);
        const getByIdC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getById').mockRejectedValue({error:"error"});
        try{
            await service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
        }catch(e){
            expect(e).toStrictEqual({error:"error"});
        }
        expect(advancedResearch).toHaveBeenCalledWith(10*(page -1), 10*page,'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
        expect(nPage).toHaveBeenCalledWith( false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
        expect(getById).toHaveBeenCalledWith(1); 
        expect(getIdsByThesisId).toHaveBeenCalledWith(1); 
        expect(getByIdC).toHaveBeenCalledWith(1); 
    }),
    test('case12: getIdsByThesisId err ', async()=>{
        const advancedResearch = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'advancedResearch').mockResolvedValue([{id:1, supervisor:1, coSupervisor:[]}]);
        const nPage = jest.spyOn(require('../../repositories/ThesisRepository.js'), 'numberOfPage').mockResolvedValue({nRows:1});
        const getById = jest.spyOn(require('../../repositories/TeacherRepository.js'), 'getById').mockResolvedValue({name:"name"});
        const getIdsByThesisId = jest.spyOn(require('../../repositories/CoSupervisorThesisRepository.js'), 'getIdsByThesisId').mockResolvedValue([{idCoSupervisor:1}, {idTeacher:1}]);
        const getByIdC = jest.spyOn(require('../../repositories/CoSupervisorRepository.js'), 'getById').mockResolvedValue({name:"coSUpervisor"});
        
        expect(service.advancedResearchThesis(page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level)).resolves
            .toStrictEqual([[{id:1, supervisor:{name:"name"},coSupervisor:[{name:"coSUpervisor"}, {email:undefined, name:"name", surname:undefined, company:"PoliTo"}] }],1]);
        
        expect(advancedResearch).toHaveBeenCalledWith(10*(page -1), 10*page,'titleD', false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
        expect(nPage).toHaveBeenCalledWith( false, title, null, [], keyword, type, groups, knowledge, expiration_date, cds, creation_date, level); 
        expect(getById).toHaveBeenCalledWith(1); 
        expect(getIdsByThesisId).toHaveBeenCalledWith(1); 
        expect(getByIdC).toHaveBeenCalledWith(1); 
    })
});