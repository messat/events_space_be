exports.handleMongoErrors = (err, req, res, next) => {
    if(err.name === "Error"){
        res.status(400).send({msg: "400 Bad Request", error: err})
    } else if(err.name === "MongoServerError" && err.errorResponse.code === 11000) {
        res.status(401).send({msg: "401 User already exists"})
    } else if(err.reason){
        res.status(400).send({msg: "400 Bad Request"})
    } else {
        next(err)   
    }
    }
    
exports.validationErrors = (err, req, res, next) => {
    if(err.name === "ValidationError"){
        const validationError = Object.keys(err.errors).map((field) => err.errors[field].message)
        res.status(400).send({msg: "400 Validation Error", errors: validationError})
    } else {
        next(err)
    }
}

exports.customErrors = (err, req, res, next) => {
    if(err.status === 404 && err.msg === "404 Route Not Found"){
        res.status(err.status).send({msg: err.msg})
    } else if(err.status === 401 && err.msg === "401 Unauthorised"){
        res.status(err.status).send({msg: err.msg})
    }else {
        next(err)
    }
}

exports.serverError = (err, req, res, next) => {
    res.status(500).send({msg: "Internal Server side error"})
}