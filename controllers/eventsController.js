const { fetchAllEvents, fetchSingleEvent, addEventToDatabase, updateEvent, deleteEventFromDatabase, registerUser, checkLogin, employeeRegisterToDatabase, staffLoginPost, signUserToEvent, fetchJoinedEventsByUser, userEventCancellation, fetchEmployeeHostedEvents } = require("../models/eventsModel")

exports.getAllEvents = async (req,res,next) => {
    try {
        const { search } = req.query
        const allEvents = await fetchAllEvents(search)
        res.status(200).send({allEvents: allEvents})
    } catch (err){
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
        const {title, start, end, description, location, event_img_url, price, duration, category, spaces, _id } = req.body
        const addEvent = await addEventToDatabase(title, start, end, description, location, event_img_url, price, duration, category, spaces, _id)
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

exports.deleteSingleEvent = async (req, res, next) => {
    try {
        const {event_id} = req.params
        const deleteEvent = await deleteEventFromDatabase(event_id)
        res.status(204).send(deleteEvent)
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
        res.status(201).send({login})
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

exports.signUserToEvent = async (req, res, next) => {
    try {
        const {event_id} = req.params
        const {_id} = req.body
        const addUserToEvent = await signUserToEvent(event_id, _id)  
        res.status(201).send({addUserToEvent})
    } catch (err) {
       next(err) 
    }
}


exports.getUserJoinedEvents = async (req, res, next) => {
    try {
        const {user_id} = req.params
        const userJoined = await fetchJoinedEventsByUser(user_id)
        res.status(200).send({userJoined})
    } catch (err) {
        next(err)
    }
}

exports.cancelEvent = async (req, res, next) => {
    try {
        const {user_id} = req.params
        const {id, spaces} = req.body
        const cancelUserEvent = await userEventCancellation(user_id, id, spaces)
        res.status(200).send({cancelUserEvent}) 
    } catch (err) {
        next(err)
    }
}

exports.getEmployeeHostedEvents = async (req, res, next) => {
    try {
        const {employee_id} = req.params
        const employeeHosted = await fetchEmployeeHostedEvents(employee_id)
        res.status(200).send({employeeHosted})
    } catch (err) {
        next(err)
    }
}