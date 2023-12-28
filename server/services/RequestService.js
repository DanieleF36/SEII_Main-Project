'use strict'
const requestRepository = require("../repositories/RequestRepository");
const requestCoSupervisorRepository = require("../repositories/RequestCoSupervisorRepository");
const teacherRepository = require("../repositories/TeacherRepository");
const coSupervisorRepository = require("../repositories/CoSupervisorRepository");
exports.addRequest = async function(request, studentId){
    request.supervisor = (await teacherRepository.getByEmail(request.supervisor)).id;
    const req = await requestRepository.addRequest(request, studentId);
    for(let i=0;i<request.cosupervisor.length;i++){
        const cosupervisor = await coSupervisorRepository.getByEmail(request.cosupervisor[i])
        if(cosupervisor.id)
            await requestCoSupervisorRepository.addCoSupervisor(req.id, cosupervisor.id);
        else{
            const internalCoSupervisor = await teacherRepository.getByEmail(request.cosupervisor[i]);
            if(internalCoSupervisor)
                await requestCoSupervisorRepository.addCoSupervisor(req.id, null, internalCoSupervisor.id);
            else
                throw new Error("coSupervisor Email "+request.cosupervisor[i]+" does not exist")
        }
    }
    return req;
}