const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const Event = require('./schema/eventSchema')
const { getAllEvents, getIndividualEvent, postEvent } = require('./controllers/eventsController')
const { handleMongoErrors, customErrors, validationErrors } = require('./errorHandlers/errorHandlers')

async function expressMongoConnection() {
    await mongoose.connect('mongodb://127.0.0.1:27017/event_space')
}

expressMongoConnection()
.then(() => console.log("Connected to Mongo (Event Space) Database "))
.catch((err) => console.log(err, "Error, Mongo Database failed to connect"))

app.use(express.json());

app.get("/", (req,res) =>{
    res.status(200).send("Event Space Back-end Server")
})

app.get("/events", getAllEvents)

app.get("/events/:event_id", getIndividualEvent)

app.post("/events", postEvent)


app.all("*", (req,res) => {
    res.status(404).send({msg: "404 Route Not Found"})
})

app.use(handleMongoErrors)

app.use(customErrors)

app.use(validationErrors)


module.exports = { app, port}