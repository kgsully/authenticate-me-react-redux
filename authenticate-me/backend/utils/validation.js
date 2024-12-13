// Body validation of the requests for routes that expect a request body is handled using the express-validator package.
// The package has 2 functions - check and validationResult that are used together to validate the request body.
// - check is a middleware function creator that checks a particular keyon teh request body.
// - validationResult gathers the results of all the check middlewares that were run to determine which parts of the body are valid and invalid.

// Express middleware called handleValidationErrors that will call validationResult from the express-validator package passing in the request.
// If there are no validation errors returned from the validationResult function, invoke the next middleware.
// If there are validation errors, create an error with all the validation error messages and invoke the next error-handling middleware.


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)

const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        const errors = validationErrors
            .array()
            .map((error) => `${error.msg}`);

        const err = Error('Bad Request.');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad request.';
        next(err);
    }
    next();
}

module.exports = {
    handleValidationErrors
};
