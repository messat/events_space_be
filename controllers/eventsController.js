const { fetchAllEvents, fetchSingleEvent, addEventToDatabase, updateEvent, deleteEventFromDatabase, registerUser, checkLogin, employeeRegisterToDatabase, staffLoginPost } = require("../models/eventsModel")

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

exports.postUser = async (req, res, next) => {
    try {
        const {firstname, lastname, email, username, password} = req.body
        const addUser = await registerUser(firstname, lastname, email, username, password)
        res.status(201).send({addUser})
    } catch (err) {
        next(err)
    }
}

exports.postLogin = async (req, res, next) => {
    try {
        const {username, password} = req.body
        const login = await checkLogin(username, password)
        res.status(200).send({login})
    } catch (err) {
        next(err)
    }
}

exports.employeeRegister = async (req, res, next) => {
    try {
        const {firstname, lastname, email, employeeNumber, password} = req.body
        const addEmployee = await employeeRegisterToDatabase(firstname, lastname, email, employeeNumber, password)
        res.status(201).send(addEmployee)
    } catch (err) {
        next(err)
    }
}


exports.employeeLogin = async (req, res, next) => {
    try {
        const {employeeNumber, password} = req.body
        const login = await staffLoginPost(employeeNumber, password)
        res.status(201).send(login)
    } catch (err) {
        next(err)
    }
}