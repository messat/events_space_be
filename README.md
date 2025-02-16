# Event Space - Backend Server 🌍

## Description
Event Space is a backend server designed to manage events, user registrations, user logins, employee registration, employee logins. Also the server is used for event hosting and tracking the attendees of the event in the case the user joining the event. It provides RESTful APIs to interact with the front-end React JS app, allowing users to join events and employees to host events.

## Tech Stack
- **Node.js** 
- **Express.js** 
- **MongoDB** (NoSQL Database)
- **Mongoose** 
- **Bcrypt.js** (Password hashing for authentication)
- **Vercel** (Hosting platform)

## Testing 
- **JEST** 
- **Supertest**

## Prerequisites
Before running this project locally, ensure the following are installed:
- Node.js (v21.7.1+ recommended, run node -v in your CLI to check the version) 
- MongoDB (run mongod in your CLI to check MongoDB exists)

## Getting Started
### 1. Clone the repository
```bash
git clone https://github.com/messat/events_space_be.git
cd events_space_be
```

### 2. Install dependencies
```bash
npm install
```

### 3. Seed the database
```bash
npm run seed
```
This will seed the mongo database. To check the database: Enter the following prompt in the CLI:
- mongosh (runs the mongosh server, now in mongo shell)
- type `show dbs` 
- type `use event_space`
- type `db.events.find({})`
This will show all events populate from the eventsData file.

### 4. Start the backend server
```bash
npm run start
```
The server will be running on `http://localhost:3000`. Paste this in your browser. 

This will use `nodemon` to automatically restart the server on code changes.


### 5 Test files.
```bash
npm run test
```
Please bear in mind, most of these files may not pass due to the event_id or user_id that is passed as parameter is unique to the local machine and the _id value is generated by MongoDB.

### 6 API Endpoints Explained.

### User Endpoints
- **POST** `/events/user/register` - Register a new user
- **POST** `/events/user/login` - User login
- **GET** `/events/user/joined/:user_id` - Get all events a user has joined
- **PATCH** `/events/user/cancelevent/:user_id` - Cancel an event registration
- **POST** `/events/signup/:event_id` - Sign up for an event

### Employee Endpoints
- **POST** `/events/employee/register` - Register an employee account
- **POST** `/events/employee/login` - Employee login
- **GET** `/events/employee/author/:employee_id` - Get all events hosted by an employee
- **DELETE** `/events/employee/deleteevent/:event_id` - Delete an event hosted by an employee

### Event Endpoints
- **GET** `/events` - Get all events
- **GET** `/events/:event_id` - Get a single event by ID
- **POST** `/events` - Create a new event
- **PATCH** `/events/:event_id` - Update an event

## Deployment
The backend server is deployed on Vercel.
### 🔗 https://events-space-be-messat.vercel.app