'use strict'
const requestService = require("../services/RequestService");
const applicationRepository = require('../repositories/ApplicationRepository');
exports.addRequest = function(req, res){
    if(req.user!='student'){
        res.status(401).json({message: "Only student can access to this API"})
    }
    applicationRepository.getActiveByStudentId(req.user.id).then(app=>{
        if (app != undefined) {
            res.status(400).json({ message: "You already have an application for a thesis" });
        }
        //Should be done the same check for request? Can a student send two request?
        requestService.addRequest(req.body, req.user.id)
        .then(request => res.status(200).json(request))
        .catch(err => res.status(500).json(err))
    })
    
}