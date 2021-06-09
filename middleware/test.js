const logModel = require('../model/logs');

exports.test = (req, res, next, currentLogId ) => {

    let current = log.find({_id:currentLogId}, (err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.send(docs);
        }
    })

    console.log('middleware starts!', req.body, 'middleware stops!');

    //....some validations go here....
    req.body.isValid = true;

    if (req.body.isValid) {
        next(); //if we do not put next() the process does not move to response
    } else {
        res.status(401).send({status:'failed' , message: 'Request is not valid'})
    }
}