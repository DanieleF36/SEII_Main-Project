'use strict';

const thesisRepository = require("../repositories/Thesisepository");

/**
 * Return a list of thesis that respect all the parameters
 *
 * page Integer
 * title String  (optional)
 * supervisor String  (optional)
 * coSupervisor List  (optional)
 * keyword String  (optional)
 * type String  (optional)
 * groups String  (optional)
 * knowledge String  (optional)
 * expiration_date String  (optional)
 * cds String  (optional)
 * creation_date String  (optional)
 * returns thesis
 **/
exports.advancedResearchThesis = function(title,supervisor,coSupervisor,keyword,type,groups,knowledge,expiration_date,cds,creation_date) {

}


/**
 * A student send his/her application for thesis {id} and attach his cv as json
 *
 * id Integer 
 **/
exports.addApplication = function(id) {
  
}


/**
 * Add a thesis
 *
 * body Thesis  (optional)
 * returns thesis
 **/
exports.addThesis = function(thesis) {
  
}

