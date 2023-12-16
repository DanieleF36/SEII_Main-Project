'use strict'
const thesisRepository = require("../repositories/ThesisRepository")

exports.thesisRequestHandling = async function (thesisId, status) {
    const thesis = await thesisRepository.getById(thesisId)
    if (!thesis) {
        throw new Error("Thesis not found")
    }
    // TODO: see how to organize the new table with the student request thesis and then complete the function
    //const res = await secretaryRepository.thesisRequestHandling(thesisId,status)
    // return res
}