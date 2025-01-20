const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const Event = require('./schema/eventSchema')
const { getAllEvents, getIndividualEvent } = require('./controllers/eventsController')

async function expressMongoConnection() {
    await mongoose.connect('mongodb://127.0.0.1:27017/event_space')
}

expressMongoConnection()
.then(() => console.log("Connected to Mongo (Event Space) Database "))
.catch((err) => console.log(err, "Error, Mongo Database failed to connect"))

app.get("/", (req,res) =>{
    res.status(200).send("Event Space Back-end Server")
})

app.get("/events", getAllEvents)

app.get("/events/:event_id", getIndividualEvent)


app.all("*", (req,res) => {
    res.status(404).send({msg: "404 Route Not Found"})
})

app.use((err, req, res, next) => {
    if(err.reason){
        res.status(400).send({msg: "400 Bad Request"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.status === 404 && err.msg === "404 Route Not Found"){
        res.status(err.status).send(err.msg)
    } else {
        next(err)
    }
})


module.exports = { app, port}