const { fetchAllEvents, fetchSingleEvent, addEventToDatabase, updateEvent, deleteEventFromDatabase } = require("../models/eventsModel")

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


exports.postEvent = async (req,res,next) => {
    try {
        const {title, date, description, location, event_img_url, price, duration, category, spaces } = req.body
        const addEvent = await addEventToDatabase(title, date, description, location, event_img_url, price, duration, category, spaces)
        res.status(201).send({addEvent})
    } catch (err) {
        next(err)
    }
}

exports.patchEvent = async (req, res, next) => {
    try {
        const {event_id} = req.params
        const incomingUpdate = req.body
        const revisedEvent = await updateEvent(event_id, incomingUpdate)
        res.status(200).send({revisedEvent})
    } catch (err) {
        next(err)
    }
}

exports.deleteEvent = async (req, res, next) => {
    try {
        const {event_id} = req.params
        await deleteEventFromDatabase(event_id)
        res.status(204).send()
    } catch (err) {
        next(err)
    }

}