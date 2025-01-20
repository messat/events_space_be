const { fetchAllEvents, fetchSingleEvent } = require("../models/eventsModel")

exports.getAllEvents = async (req,res,next) => {
    try {
        const allEvents = await fetchAllEvents()
        res.status(200).send({allEvents: allEvents})
    } catch {
        next(err)
    }
}

exports.getIndividualEvent = async (req,res,next) => {
    try {
        const { event_id } = req.params
        const singleEvent = await fetchSingleEvent(event_id)
        if(!singleEvent) {
            throw singleEvent
        }
        res.status(200).send({singleEvent})
        
    } catch (err) {
        next(err)
    }
}

