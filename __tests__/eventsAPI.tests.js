const request = require('supertest');
const { app } = require('../app')
const mongoose = require('mongoose');

beforeAll(done => {
    done()
  })
  
afterAll(done => {
    mongoose.connection.close()
    done()
})

describe('Test the basic Endpoint "\/" sends a string message', () => {
    test('/ GET sends a message to confirm the server is running successfully', () => {
        return request(app)
            .get("/")
            .expect(200)
            .then((response) => {
                expect(response.text).toBe('Event Space Back-end Server')
            })
    });
});


describe('Creating RESTful route GET /events to retrieve all events', () => {
    test('Status 200: fetches all events in the array', () => {
        return request(app)
            .get("/events")
            .expect(200)
            .then(({text}) => {
                const allEventsArr = JSON.parse(text)
                allEventsArr.allEvents.forEach((event) => {
                    expect(event).toMatchObject({
                    _id: expect.any(String),
                    title: expect.any(String),
                    date: expect.any(String),
                    description: expect.any(String),
                    location: expect.any(String),
                    event_img_url: expect.any(String),
                    price: expect.any(Number),
                    duration: expect.any(Number),
                    category: expect.any(String),
                    spaces: expect.any(Number),
                    })
                })
            })
    });
    
    test('Status 404: API Endpoint not found. Sends an error message to the server', () => {
        return request(app)
            .get("/eventsssss")
            .expect(404)
            .then(({text}) => {
                const errorMessage = JSON.parse(text)
                expect(errorMessage.msg).toBe("404 Route Not Found")
            })
    });
});


describe('Creating RESTful Route GET /events/:event_id to retrieve single document', () => {
    test('Status 200: Fetches single event by event ID', () => {
        return request(app)
            .get("/events/678ea2a69e3f9dd60312b273")
            .expect(200)
            .then(({text}) =>{
                const event = JSON.parse(text)
                expect(event.singleEvent).toMatchObject({
                    _id: expect.any(String),
                    title: expect.any(String),
                    date: expect.any(String),
                    description: expect.any(String),
                    location: expect.any(String),
                    event_img_url: expect.any(String),
                    price: expect.any(Number),
                    duration: expect.any(Number),
                    category: expect.any(String),
                    spaces: expect.any(Number),
                })
            })
    });

    test('Status 400: When the the event_id (Object ID) is of incorrect length i.e. greater than 24', () => {
        return request(app)
            .get("/events/678d51fc4980701f2e8f99fd20")
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text)
                expect(parseError.msg).toBe("400 Bad Request")
            })
    });

    test('Status 404: When the the event_id (Object ID) has the correct length - 24 characters but the document does not exist in database', () => {
        return request(app)
            .get("/events/678d51fc4980701f2e8f99ef")
            .expect(404)
            .then(({text}) => {
                expect(text).toBe("404 Route Not Found")
            })
    });

    test('Status 400: error message when the the event_id (Object ID) does not contain any integer', () => {
        return request(app)
            .get("/events/not-a-number")
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text)
                expect(parseError.msg).toBe("400 Bad Request")
            })
    });

    test('Status 400: Error message when the the event_id (Object ID) only contains integer', () => {
        return request(app)
            .get("/events/947478478474")
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text)
                expect(parseError.msg).toBe("400 Bad Request")
            })
    });
});


describe('Adding new event using POST method /events to the database', () => {
    test('Status 201: Adds new event to the the database', () => {
        const newEvent = {
            title: "Watercolour Brush Lettering",
            date: "Sat, 25 Jan 2025 10:30 - 13:30 GMT",
            description: "Brush lettering is such a beautiful and fun lettering form, we will go through an introduction to brush lettering and watercolour- teaching you how to manipulate the brush for various strokes and widths. We’ll go through the alphabet and form words.",
            location: "54 Otley Road Leeds LS6 2AL",
            event_img_url: "https://www.lagebaston.com/wp-content/uploads/2015/05/mixed-media-painting.jpg",
            price: 12,
            duration: 3,
            category: "Art",
            spaces: 20
        }
        return request(app)
            .post("/events")
            .send(newEvent)
            .expect(201)
            .then(({text}) => {
                const parseEvent = JSON.parse(text)
                expect(parseEvent.addEvent.title).toBe("Watercolour Brush Lettering")
                expect(parseEvent.addEvent.price).toBe(12)
                expect(parseEvent.addEvent.category).toBe("Art")
            })
    });

    test('Status 201: Ignores fields not included in the event schema and creates a new event', () => { 
        const newEvent = {
            title: "Introduction to Pottery",
            date: "Sun, 26 Jan 2025 14:00 - 17:00 GMT",
            description: "Explore the basics of pottery in this hands-on workshop. Learn techniques for shaping and molding clay, and create your own unique piece to take home. Perfect for beginners and anyone looking to try something creative.",
            location: "35 Chapel Street, Manchester M3 5DF",
            event_img_url: "https://www.thesprucecrafts.com/thmb/dp94k5qFzMe9QhtZhFO8K6b2RHg=/1885x1414/smart/filters:no_upscale()/Pottery-wheel-working-gettyimages-147024332-589fdfed5f9b58819c0f876b.jpg",
            price: 25,
            duration: 3,
            category: "Art",
            spaces: 15,
            votes: 10,
            northcoders_rating: 20
        };
        return request(app)
            .post("/events")
            .send(newEvent)
            .expect(201)
            .then(({text}) => {
                const parseEvent = JSON.parse(text)
                expect(parseEvent.addEvent.title).toBe("Introduction to Pottery")
                expect(parseEvent.addEvent.price).toBe(25)
                expect(parseEvent.addEvent.category).toBe("Art")
            })
    });
    test('Status 400: A form field missing - event_img_url - error message', () => {
        const newEvent = {
            title: "Watercolour Brush Lettering",
            date: "Sat, 25 Jan 2025 10:30 - 13:30 GMT",
            location: "54 Otley Road Leeds LS6 2AL",
            description: "Hello from mongo shell",
            price: 12,
            duration: 3,
            category: "Art",
            spaces: 20,
            cars: 20
        }
        return request(app)
            .post("/events")
            .send(newEvent)
            .expect(400)
            .then(({text}) => {
                const parseMessage = JSON.parse(text)
                expect(parseMessage.msg).toBe("400 Missing Validation")
            })
    });
});

describe('Update a single event using PATCH request /events/:event_id', () => {
    test('Status 200: Update event with the the matching event_id in the database', () => {
        const updateEvent = {
                title: "From Data to Cyber Security: Exploring DMU’s Tech Apprenticeships",
                date: "Wed, 12 Feb 2025 12:00 - 13:00 GMT",
                description: "Join us for an exclusive online information session tailored for employers and current technology professionals. This interactive webinar will explore the benefits of higher and degree apprenticeships, focusing on Level 4 Data Analyst, Level 4 Business Analyst, Level 6 Data Scientist, Level 6 Cyber Security Technical Professional, Level 6 Digital and Technology Solutions Technical Professional, Level 6 Digital User Experience (UX) Professional, and Level 7 Artificial Intelligence data specialist apprenticeships.",
                location: "Leeds",
                event_img_url: "https://www.securitymagazine.com/ext/resources/images/cyber-products-tech-fp1170x650.jpg?1671553963",
                price: 25,
                duration: 1,
                category: "tech",
                spaces: 45
        }
        return request(app)
            .patch("/events/678ea2a69e3f9dd60312b265")
            .send(updateEvent)
            .expect(200)
            .then(({text}) => {
                const parseUpdatedEvent = JSON.parse(text).revisedEvent
                expect(parseUpdatedEvent.spaces).toBe(45)
                expect(parseUpdatedEvent.price).toBe(25)
            })
    });

    test('Status 400: Error message as the event_id does not exist', () => {
        const updateEvent = {
                title: "From Data to Cyber Security: Exploring DMU’s Tech Apprenticeships",
                spaces: 45
        }
        return request(app)
            .patch("/events/678ea2a69e3f9dd60312b4")
            .send(updateEvent)
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Bad Request")
            })
    });

    test('Status 400: Error message as the event_id does not exist', () => {
        const updateEvent = {
            title: "From Data to Software engineering: Exploring DMU’s Tech Apprenticeships",
            spaces: 45
    }
        return request(app)
            .patch("/events/678ea2a69e3f9dd60312b255")
            .send(updateEvent)
            .expect(404)
            .then(({text}) => {
                expect(text).toBe("404 Route Not Found")
            })
    });
});