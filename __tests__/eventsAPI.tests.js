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
    test('/ sends a message to confirm the server is running successfully', () => {
        return request(app)
            .get("/")
            .expect(200)
            .then((response) => {
                expect(response.text).toBe('Event Space Back-end Server')
            })
    });
});


describe('Creating RESTful route /events to retrieve all events', () => {
    test('Status 200: fetches all events in the array', () => {
        return request(app)
            .get("/events")
            .expect(200)
            .then(({text}) => {
                const allEventsArr = JSON.parse(text)
                expect(allEventsArr.allEvents).toHaveLength(8)
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