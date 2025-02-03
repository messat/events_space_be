if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const cors = require('cors')
const { getAllEvents, getIndividualEvent, postEvent, patchEvent, postUser, postLogin, employeeRegister, employeeLogin, signUserToEvent, getUserJoinedEvents, cancelEvent, getEmployeeHostedEvents, deleteSingleEvent } = require('./controllers/eventsController')
const { handleMongoErrors, customErrors, validationErrors, serverError } = require('./errorHandlers/errorHandlers')

const databaseURL = process.env.NODE_ENV !== "production" ? 'mongodb://127.0.0.1:27017/event_space' : process.env.DB_URL

async function expressMongoConnection() {
        await mongoose.connect(databaseURL)
}

expressMongoConnection()
.then(() => console.log("Connected to Mongo (Event Space) Database "))
.catch((err) => console.log(err, "Error, Mongo Database failed to connect"))

app.use(cors())
app.use(express.json());

app.get("/", (req,res) =>{
    res.status(200).send("Event Space Back-end Server")
})

app.get("/events", getAllEvents)

app.post("/events", postEvent)

app.post("/events/user/register", postUser)

app.post("/events/user/login", postLogin)

app.post("/events/employee/register", employeeRegister)

app.post("/events/employee/login", employeeLogin)

app.get("/events/employee/author/:employee_id", getEmployeeHostedEvents)

app.delete("/events/employee/deleteevent/:event_id", deleteSingleEvent)


app.get("/events/user/joined/:user_id", getUserJoinedEvents)

app.patch("/events/user/cancelevent/:user_id", cancelEvent)

app.post("/events/signup/:event_id", signUserToEvent)

app.get("/events/:event_id", getIndividualEvent)

app.patch("/events/:event_id", patchEvent)




app.all("*", (req,res) => {
    res.status(404).send({msg: "404 Route Not Found"})
})

app.use(handleMongoErrors)

app.use(customErrors)

app.use(validationErrors)


app.use(serverError)


module.exports = { app, port }


