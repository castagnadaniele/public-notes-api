function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    res.json(err.toString())
}

module.exports = errorHandler
