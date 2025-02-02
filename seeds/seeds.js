const Event = require('../schema/eventSchema')
const eventsData = require('../data/eventsData')
const mongoose = require('mongoose')

async function expressMongoConnection() {
    await mongoose.connect('mongodb://127.0.0.1:27017/event_space')
}

expressMongoConnection()
.then(() => console.log("Connected to Mongo (Event Space) Database "))
.catch((err) => console.log(err, "Error, Mongo Database failed to connect"))


mongoose.connection.on("open", () =>{
    console.log("Database connection is open")
})
mongoose.connection.on("connected", ()=> {
    console.log("Database connected")
})
mongoose.connection.on('error', err => {
    console.log("Connection Error:", err);
})

const seedEventDatabase = async () => {
    await Event.deleteMany({})
    for(let i=0; i<eventsData.length; i++){

        const eventObj = eventsData[i]

        const event = new Event({
            title: eventObj.title,
            start: eventObj.start,
            end: eventObj.end,
            description: eventObj.description,
            location: eventObj.location,
            event_img_url: eventObj.event_img_url,
            price: eventObj.price,
            duration: eventObj.duration,
            category: eventObj.category,
            spaces: eventObj.spaces,
            author: eventObj.author
        })
        await event.save()
    }
    
}

seedEventDatabase()
.then(() => {
    mongoose.connection.close()
})

