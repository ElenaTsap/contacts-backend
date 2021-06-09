const logModel = require('../model/logs')

exports.logger = (req, res, next) => {
    //read the path and request
    const log = new logModel({
        dateTime: Date.now(),
        path: req.originalUrl
    })

    log.save((err, docs) => {
        console.log(err);
        if (err) {
            res.status(500).send({status: 'failed', message: 'Please try again', data:err.errors})
        } else {
            //create a new property in our request that has the logs id from mongoDB
            req.logId = docs._id;
            next();
        }
    })
}