'use strict'

const dayjs = require('dayjs')


let offset = 0
/**
 * Called by API for retriving the current date according to the state of the server
 * @param {*} req none
 * @param {*} res date (even shifted one)
 */
exports.vc_current = async function (req, res) {

    let result
    if (offset >= 0)
        result = dayjs().add(offset, 'second')
    else result = dayjs().subtract(offset, 'second')
    return res.status(200).json(result.format('YYYY-MM-DDThh:mm').toString())
}

/**
 * To be called in backend functions instead of dayjs()
 * Return current time according to the OFFSET_TIME stored into the environment
 * @returns a dayjs object
*/
exports.vc = function () {
    let result
    if (offset >= 0)
        result = dayjs().add(offset, 'second')
    else result = dayjs().subtract(offset, 'second')
    return result
}

/**
 * Function to be routed outside and being used by frontend as API for setting
 * a time offset in seconds. This value is going to be stored into a environment
 * variable file called environment.env as OFFSET_TIME
 * @param {*} req body: {
 *  value: new date in format (YYYY-MM-DD)
 * }
 * @param {*} res body: { value: }
 */
exports.vc_set = async function (req, res) {
    if (req.body === undefined || req.body.value === undefined)
        return res.status(400).json({ error: "body is missing or wrong" })

    if (!dayjs(req.body.value).isValid())
        return res.status(400).json({ error: "wrong parameter" })

    const now = dayjs()
    const act = dayjs(req.body.value, 'YYYY-MM-DDThh:mm')

    const duration = act.diff(now, 'second');
    console.log(duration)

    offset = duration;
    return res.status(200).json({ value: req.body.value })
}

/**
 * Restore the system's clock
 * @param {*} req body: {
 *  value: Integer 1 (true) | whatever (error)
 * }
 * @param {*} res {value: Integer}
 */
exports.vc_restore = async function (req, res) {
    if (req.body === undefined || req.body.value === undefined)
        return res.status(400).json({ error: "body is missing or wrong" })
    if (req.body.value != 1)
        return res.status(400).json({ error: "wrong parameter" })

    offset = 0
    return res.status(200).json({ value: req.body.value })

}