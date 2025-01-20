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

exports.addEventToDatabase = async (title, date, description, location, event_img_url, price, duration, category, spaces) => {
    try {
        const newEvent = await Event.create({title: title, date: date, description: description, location: location, event_img_url: event_img_url, price: price, duration: duration, category: category, spaces: spaces})
        return newEvent
    } catch (err) {
        throw err
    }
}

exports.updateEvent = async (event_id, incomingUpdate) => {
    try {
        const findAndUpdateEvent = await Event.findByIdAndUpdate(event_id, incomingUpdate, {new: true})
        if(!findAndUpdateEvent){
            throw {status: 404, msg: "404 Route Not Found"}
        }
        return findAndUpdateEvent
    } catch (err) {
        throw err
    }
}