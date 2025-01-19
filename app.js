const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const Event = require('./schema/eventSchema')

async function expressMongoConnection() {
    await mongoose.connect('mongodb://127.0.0.1:27017/event_space')
}

expressMongoConnection()
.then(() => console.log("Connected to Mongo (Event Space) Database "))
.catch((err) => console.log(err, "Error, Mongo Database failed to connect"))

app.get("/", (req,res) =>{
    res.status(200).send("Event Space Back-end Server")
})

app.get("/events", async (req,res) => {
    const allEvents = await Event.find()
    res.status(200).send({allEvents: allEvents})
})

app.all("*", (req,res) => {
    res.status(404).send({msg: "404 Route Not Found"})
})


module.exports = { app, port}