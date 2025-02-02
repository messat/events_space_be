const mongoose = require("mongoose")
const { Schema } = mongoose

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
      },
    start: {
        type: String,
        required: true
      },
    end: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
      },
    location: {
        type: String,
        required: true
      },
    event_img_url: {
        type: String,
        required: true
      },
    price: {
        type: Number,
        required: true
      },
    duration: {
        type: Number,
        required: true
      },
    category: {
        type: String,
        required: true
      },
    spaces: {
        type: Number,
        required: true
      },
    author: { type: Schema.Types.ObjectId, 
      ref: 'Employee'
    },
    attendees: [
      {
        type: Schema.Types.ObjectId, ref: 'User'
      }
    ]
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event



