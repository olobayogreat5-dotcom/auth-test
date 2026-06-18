const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    const responseBody = { error: { message } };
    if (err.details) {
        responseBody.error.details = err.details;
    }
    res.status(status).json(responseBody);
};

module.exports = errorHandler;