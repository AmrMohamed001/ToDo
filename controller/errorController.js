const handleDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        data: {
            message: err.message,
            stack: err.stack,
            error: err,
        }
    })
}
const handleProd = (err, res) => {
}

module.exports = (err, req, res, next) => {
    err.statusCode ||= 500
    err.status ||= 'Failed'
    if (process.env.NODE_ENV === 'development') handleDev(err, res)
    else if (process.env.NODE_ENV === 'production') handleProd(err, res)
}