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
                expect(allEventsArr.allEvents).toHaveLength(8)
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
            .get("/events/678d51fc4980701f2e8f99fd")
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

    test('Status 400: When the the Object ID is of incorrect length i.e. greater than 24', () => {
        return request(app)
            .get("/events/678d51fc4980701f2e8f99fd20")
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text)
                expect(parseError.msg).toBe("400 Bad Request")
            })
    });

    test('Status 404: When the the Object ID has the correct length - 24 characters but the document does not exist in database', () => {
        return request(app)
            .get("/events/678d51fc4980701f2e8f99ef")
            .expect(404)
            .then(({text}) => {
                expect(text).toBe("404 Route Not Found")
            })
    });

    test('Status 400: error message when the the Object ID does not contain any integer', () => {
        return request(app)
            .get("/events/not-a-number")
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text)
                expect(parseError.msg).toBe("400 Bad Request")
            })
    });

    test('Status 400: Error message when the the Object ID only contains integer', () => {
        return request(app)
            .get("/events/947478478474")
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text)
                expect(parseError.msg).toBe("400 Bad Request")
            })
    });
});