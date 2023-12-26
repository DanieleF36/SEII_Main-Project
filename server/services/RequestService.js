'use strict'
const requestRepository = require("../repositories/RequestRepository");
const requestCoSupervisorRepository = require("../repositories/RequestCoSupervisorRepository");
const teacherRepository = require("../repositories/TeacherRepository");
const coSupervisorRepository = require("../repositories/CoSupervisorRepository");
exports.addThesis = async function(request, studentId){
    request.supervisor = (await teacherRepository.getByEmail(request.supervisor)).id;

    const req = await requestRepository.addThesis({...request, studentId});
    for(let i=0;i<request.cosupervisors.length;i++){
        const cosupervisor = await coSupervisorRepository.getByEmail(request.cosupervisors[i])
        if(cosupervisor)
            await requestCoSupervisorRepository.addCoSupervisor(req.id, cosupervisor);
        else{
            const internalCoSupervisor = await teacherRepository.getByEmail(request.cosupervisors[i]);
            if(internalCoSupervisor)
                await requestCoSupervisorRepository.addCoSupervisor(req.id, null, internalCoSupervisor);
            else
                throw new Error("coSupervisor Email "+request.cosupervisors[i]+" does not exist")
        }
    }
    return req;
}