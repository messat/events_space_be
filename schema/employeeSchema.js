const mongoose = require("mongoose")
const { Schema } = mongoose

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    employeeNumber: {
        type: Number,
        required: true,
        unique: true,
        min: [10000000, 'Must be 8 characters long'],
        max: [99999999, "Must be 8 characters long"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["employee"],
        default: "employee"
    }
})

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee