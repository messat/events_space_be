const request = require('supertest');
const { app } = require('../app')
const mongoose = require('mongoose');
const { json } = require('express');
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
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("404 Route Not Found")
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
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("404 Route Not Found")
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
                expect(parseMessage.msg).toBe("400 Validation Error")
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

    test('Status 400: Error message as the event_id does not exist not conforming to 24 characters (Object ID)', () => {
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

    test('Status 400: Error message as the event_id does not exist despite containing 24 characters', () => {
        const updateEvent = {
            title: "From Data to Software engineering: Exploring DMU’s Tech Apprenticeships",
            spaces: 45
    }
        return request(app)
            .patch("/events/678ea2a69e3f9dd60312b255")
            .send(updateEvent)
            .expect(404)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("404 Route Not Found")
            })
    });
});


describe('Delete event using DELETE Route /events/:event_id', () => {
    test.skip('Status 204: Delete event with no content sent to the server', () => {
        return request(app)
            .delete("/events/678ec39331f7c3492aa4a344")
            .expect(204)
    });
    test('Status 404: Error message displayed when event_id that does not exist (Object ID) in database', () => {
        return request(app)
            .delete("/events/678ec39331f7c3492aa4a376")
            .expect(404)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("404 Route Not Found")
            })
    });
    test('Status 400: Error message displayed when event_id that does not exist i.e. not an Mongo ID', () => {
        return request(app)
            .delete("/events/not-a-number")
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Bad Request")
            })
    });
});


describe('Creating register user POST route to enable users to register an account', () => {
    test.skip('Status 201: User sends POST request and the password is hashed before it is saved to the database', () => {
        const register = {
            firstname: "Farhana",
            lastname: "Patel",
            email: "farhanapatel@hotmail.co.uk",
            username: "fpatel",
            password: "Porsche"
        }
        return request(app)
            .post("/events/user/register")
            .send(register)
            .expect(201)
            .then(({text}) => {
                const parseUser = JSON.parse(text).addUser
                expect(parseUser.password).not.toBe("Porsche")
                expect(parseUser.username).toBe("fpatel")
            })
    });

    test('Status 401: Error response as the email address already exists in the server', () => {
        const register = {
            firstname: "Farhana",
            lastname: "Patel",
            email: "farhanapatel@hotmail.co.uk",
            username: "fPorscheLove",
            password: "Porsche"
        }
        return request(app)
            .post("/events/user/register")
            .send(register)
            .expect(401)
            .then(({text}) => {
                const parseUser = JSON.parse(text).msg
               expect(parseUser).toBe("401 User already exists")
            })
    });

    test('Status 401: Error response as the username already exists in the database', () => {
        const register = {
            firstname: "Farhana",
            lastname: "Patel",
            email: "healthnhs@nhs.co.uk",
            username: "fpatel",
            password: "Ferrari"
        }
        return request(app)
            .post("/events/user/register")
            .send(register)
            .expect(401)
            .then(({text}) => {
                const parseUser = JSON.parse(text).msg
               expect(parseUser).toBe("401 User already exists")
            })
    });

    test('Status 400: Error message when lastname is missing - does not follow schema validation', () => {
        const register = {
            firstname: "Farhana",
            email: "farhana@hotmail.co.uk",
            username: "fpatel",
            password: "Ferrari"
        }
        return request(app)
            .post("/events/user/register")
            .send(register)
            .expect(400)
            .then(({text}) => {
                const parseUser = JSON.parse(text)
               expect(parseUser.msg).toBe("400 Validation Error")
            })
    });

    test('Status 400: Error message displayed when the password field is missing', () => {
        const register = {
            firstname: "Farhana",
            lastname: "Patel",
            email: "farhana@hotmail.co.uk",
            username: "fpatel",
        }
        return request(app)
            .post("/events/user/register")
            .send(register)
            .expect(400)
            .then(({text}) => {
                const parseUser = JSON.parse(text).msg
               expect(parseUser).toBe("400 Bad Request")
            })
    });
});


describe('Login POST route utilised to log in the user', () => {
    test('Status 200: User successfully logged in', () => {
        const user = {
            username: "fpatel",
            password: "Porsche"
        }
        return request(app)
            .post("/events/user/login")
            .send(user)
            .expect(200)
            .then(({text}) => {
                const parseLogin = JSON.parse(text).login
                expect(parseLogin.username).toBe("fpatel")
                expect(parseLogin.password).not.toBe("Porsche")
            })
    });

    test('Status 401: Error message when username not found in the database', () => {
        const user = {
            username: "messat",
            password: "Porsche"
        }
        return request(app)
            .post("/events/user/login")
            .send(user)
            .expect(401)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("401 Unauthorised")
            })
    });

    test('Status 401: Error message when password entered does not match the hash password in the database', () => {
        const user = {
            username: "fpatel",
            password: "Ferrari"
        }
        return request(app)
            .post("/events/user/login")
            .send(user)
            .expect(401)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("401 Unauthorised")
            })
    });

    test('Status 401: Unauthorised error message when the password field is missing', () => {
        const user = {
            username: "fpatel",
        }
        return request(app)
            .post("/events/user/login")
            .send(user)
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Bad Request")
            })
    });

    test('Status 400: Error message when the username field is missing', () => {
        const user = {
            password: "Porsche"
        }
        return request(app)
            .post("/events/user/login")
            .send(user)
            .expect(401)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("401 Unauthorised")
            })
    });
});


describe('Creating POST Route to register an employee', () => {
    test.skip('Status 201: Adds employee to the database with hash password and employee Number', () => {
        const employeeRegister = {
            firstname: "Yusuf",
            lastname: "Patel",
            email: "Yosi63@gmail.com",
            employeeNumber: 87654231,
            password: "FerrariF1"
        }
        return request(app)
            .post("/events/employee/register")
            .send(employeeRegister)
            .expect(201)
            .then(({text}) => {
                const parseEmployeeDetails = JSON.parse(text)
                expect(parseEmployeeDetails.password).not.toBe("FerrariF1")
                expect(parseEmployeeDetails.employeeNumber).toBe(87654231)
                expect(parseEmployeeDetails.lastname).toBe("Patel")
            })
    });

    test('Status 400: firstname is missing field with error message', () => {
        const employeeRegister = {
            lastname: "Patel",
            email: "Yosi63@gmail.com",
            employeeNumber: 87654231,
            password: "FerrariF1"
        }
        return request(app)
            .post("/events/employee/register")
            .send(employeeRegister)
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Validation Error")
            })
    });

    test('Status 400: Email is missing field - fails mongoose validation', () => {
        const employeeRegister = {
            firstname: "Yusuf",
            lastname: "Patel",
            employeeNumber: 87654231,
            password: "FerrariF1"
        }
        return request(app)
            .post("/events/employee/register")
            .send(employeeRegister)
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Validation Error")
            })
    });

    test('Status 401: Employee number is longer than 8 characters - not valid employee number', () => {
        const employeeRegister = {
            firstname: "Yusuf",
            lastname: "Patel",
            email: "Yosi63@gmail.com",
            employeeNumber: 8765423145,
            password: "FerrariF1"
        }
        return request(app)
            .post("/events/employee/register")
            .send(employeeRegister)
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Validation Error")
            })
    });
});


describe('Creating POST Route to login to the employee account', () => {
    test('Status 201: Employee login successful', () => {
        const employeeLogin = {
            employeeNumber: 87654231,
            password: "FerrariF1"
        }
        return request(app)
            .post("/events/employee/login")
            .send(employeeLogin)
            .expect(201)
            .then(({text}) => {
                const parseLogin = JSON.parse(text)
                expect(parseLogin.password).not.toBe(employeeLogin.password)
                expect(parseLogin.employeeNumber).toBe(employeeLogin.employeeNumber)
            })
    });

    test('Status 401: Missing employee number field with an error message response', () => {
        const employeeLogin = {
            password: "FerrariF1"
        }
        return request(app)
            .post("/events/employee/login")
            .send(employeeLogin)
            .expect(401)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("401 Unauthorised")
            })
    });


    test('Status 401: Employee number less than 8 characters displaying error message', () => {
        const employeeLogin = {
            employeeNumber: 8765423,
        }
        return request(app)
            .post("/events/employee/login")
            .send(employeeLogin)
            .expect(401)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("401 Unauthorised")
            })
    });
});


describe('Filter events by query search using the URL', () => {
    test('Status 200: A successful search generates an array of events', () => {
        return request(app)
            .get("/events?search=cyber")
            .expect(200)
            .then(({text}) => {
                const parseSearch = JSON.parse(text).allEvents
                expect(parseSearch).toHaveLength(1)
            })
    });

    test('Status 200: A search which does not match any events displays a message', () => {
        return request(app)
            .get("/events?search=iPhone")
            .expect(200)
            .then(({text}) => {
                const parseSearch = JSON.parse(text).allEvents
                expect(parseSearch).toBe("No Search Found With The Title iPhone")
            })
    });
});


describe('Signing the user to the event i.e. referencing the user to the event in the Mongo database', () => {
    test('Status 201: Successfully assigns the user to the event', () => {
        const user = {_id : "679781c31cd20dd913da719a" }
        return request(app)
            .post("/events/signup/678ea2a69e3f9dd60312b265")
            .send(user)
            .expect(201)
            .then(({text}) => {
                const parseEvent = JSON.parse(text).addUserToEvent
                expect(parseEvent.attendees).toContain("679781c31cd20dd913da719a")
            })
    });

    test('Status 400: Error message when the _id does not match the user in the database when signing up - server side validation', () => {
        const user = {_id : "679781c31cd20dd913da719q" }
        return request(app)
            .post("/events/signup/678ea2a69e3f9dd60312b265")
            .send(user)
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Bad Request")
            })
    });

    test('Status 400: Error message when the event_id (parametric endpoint) does not match the event in the database when signing up - server side validation', () => {
        const user = {_id : "679781c31cd20dd913da719q" }
        return request(app)
            .post("/events/signup/678ea2a69e3f9dd60312b265aa")
            .send(user)
            .expect(400)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Bad Request")
            })
    });

    test('Status 404: Error message when the event_id does not exist in the database but has 24 characters (conforming with Mongo ObjectID)', () => {
        const user = {_id : "679781c31cd20dd913da719a" }
        return request(app)
            .post("/events/signup/678ea2a69e3f9dd60312b215")
            .send(user)
            .expect(404)
            .then(({text}) => {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("404 Route Not Found")
            })
    });
});


describe('User signed up to the event upon clicking sign up button, the user _id is referenced to the employee collection', () => {
    test('Status: 200 User successfully signs up to the event', () => { 
        return request(app)
            .get("/events/user/joined/679781c31cd20dd913da719a")
            .expect(200)
            .then(({text})=> {
                const parseEvents = JSON.parse(text).userJoined
                parseEvents.forEach((event) => {
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
                    attendees: expect.any(Array)
                    })
                })
            })
    });

    test('Status: 400 Error message as the user_id is not found in the database', () => { 
        return request(app)
            .get("/events/user/joined/679781c31cd20dd913da75a")
            .expect(400)
            .then(({text})=> {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Bad Request")
            })
    });
});


describe('User cancels their ticket for the single event', () => {
    test.skip('Status: 200 Patch request to update the attendees array in a single event - removal of user attendance', () => {
        const event = {
            id: "678ea2a69e3f9dd60312b265",
            spaces: 44
        }
        return request(app)
            .patch("/events/user/cancelevent/679781c31cd20dd913da719a")
            .send(event)
            .expect(200)
            .then(({text})=> {
                const parseEvents = JSON.parse(text).cancelUserEvent
                expect(parseEvents.spaces).toBe(45)
                expect(parseEvents.attendees).not.toContain("678ea2a69e3f9dd60312b265")
            })
    });

    test('Status: 400 Error message when the user id does not exist in the users collection database', () => {
        const event = {
            id: "678ea2a69e3f9dd60312b265",
            spaces: 44
        }
        return request(app)
            .patch("/events/user/cancelevent/679781c31cd20dd913719a")
            .send(event)
            .expect(400)
            .then(({text})=> {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Bad Request")
            })
    });

    test('Status: 400 Error message when the event id does not exist in the events collection database', () => {
        const event = {
            id: "678ea2a69e3f9dd602b265",
            spaces: 44
        }
        return request(app)
            .patch("/events/user/cancelevent/679781c31cd20dd913719a")
            .send(event)
            .expect(400)
            .then(({text})=> {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Bad Request")
            })
    });
});


describe('Employee cancels the event deleting the single event including foreign keys references to other tables', () => {
    test.skip('Status 204: Employee deletes the event successfully and the attendees too (foreign key)', () => {
        return request(app)
            .delete("/events/employee/deleteevent/6798c7bdf941a80457c39dcb")
            .expect(204)
    });

    test('Status 404 Event ID not found in the database from the params', () => {
        return request(app)
            .delete("/events/employee/deleteevent/67914b027f7405f3986673")
            .expect(400)
            .then(({text})=> {
                const parseError = JSON.parse(text).msg
                expect(parseError).toBe("400 Bad Request")
            })
    });
});

