'use strict'
const dayjs = require('../dayjsvc/index.dayjsvc')
const thesisRepository = require('../repositories/ThesisRepository')

/**
 * Task scheduled by node-cron for updating the DB by setting expired thesis
 * and relative applications with the following logic:
 * 
 * thesis becames archived
 * related applications:
 * pending --> cancelled (0 -> 3)
 * accepted --> accepted (1 -> 1)
 * rejected --> rejected (2 -> 2)
 */
exports.setExpired = function(){
    const now = dayjs.vc()
    thesisRepository.selectExpiredAccordingToDate(now.format('YYYY-MM-DD').toString())
        .then((result) => {
            if(!Array.isArray(result)) {
                return {error: 'server error'}
            }
            thesisRepository.setExpiredAccordingToIds(result)
                .then((result) => {
                    if(!result) {
                        return {error: 'server error'}
                    }
                    else {
                        return {value: 'ok'}
                    }
                })
                .catch(err => {
                    console.log("xiao")
                    return {error: err}
                })
        })
        .catch(err => {
            return {message: err}
        })
}