const Event = require("../schema/eventSchema")

exports.fetchAllEvents = async () => {
    const allEvents = await Event.find()
    return allEvents
}

exports.fetchSingleEvent = async (event_id) => {
    try {
        const individualEvent = await Event.findById(event_id)
        if(!individualEvent){
            throw {status: 404, msg: "404 Route Not Found"}
        }
        return individualEvent
    } catch (err) {
        throw err
    }
}