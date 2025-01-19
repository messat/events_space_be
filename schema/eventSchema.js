const mongoose = require("mongoose")
const { Schema } = mongoose

const eventSchema = new Schema({
    title: String,
    date: String,
    description: String,
    location: String,
    event_img_url: String,
    price: Number,
    duration: Number,
    category: String,
    spaces: Number,
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event



