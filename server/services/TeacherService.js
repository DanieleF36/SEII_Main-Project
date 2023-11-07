'use strict';

const teacherRepository = require("../repositories/TeacherRepository");

/**
 * Theacher accept or reject an application
 *
 * accepted bool  
 * id_professor Integer 
 * id_application Integer 
 * no response value expected for this operation
 **/
exports.accRefApplication = async function(accepted,id_professor,id_application) {
    try {
        if(accepted!=undefined, id_professor!=null, id_application!=null) {
            let res = await ApplicationRepository.accRefApplication(accepted,id_professor,id_application);
        }
        return res;
    } catch(error) {
        res.status(500).json({error: error.message})
    }
  
}


/**
 * Get all the application for the professor
 *
 * id_professor Integer 
 * returns List
 **/
exports.listApplication = async function(id_professor) {
    try{
        if(id_professor!=null){
            console.log("SERVICE");
            let res = await ApplicationRepository.getApplication(id_professor)
        }
        return res;

    } catch(error){
        res.status(500).json({ error: error.message })
    }
  
}
