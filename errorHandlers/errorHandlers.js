exports.handleMongoErrors = (err, req, res, next) => {
       if(err.reason){
            res.status(400).send({msg: "400 Bad Request"})
        }
        next(err)   
}

exports.validationErrors = (err, req, res, next) => {
    if(err.errors.title || err.errors.date || err.errors.description || err.errors.location || err.errors.event_img_url || err.errors.price || err.errors.duration || err.errors.category || err.errors.spaces) {
        res.status(400).send({msg: "400 Missing Validation"})
    }
    next(err)
}

exports.customErrors = (err, req, res, next) => {
    if(err.status === 404 && err.msg === "404 Route Not Found"){
        res.status(err.status).send(err.msg)
    }
    next(err)
}