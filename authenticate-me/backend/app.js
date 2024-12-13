// Import express and express middleware packages
const express = require('express');
require('express-async-errors');    // THIS IS REQUIRED IN ORDER TO HANDLE SEQUELIZE ERROR HANDLING!
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Determine environment based upon environment variables
// Create / set isProduction flag based upon environment variable determined from index.js
const { environment } = require('./config');
const isProduction = environment === 'production';

// Initialize the express application
const app = express();

// ---------------------------------------------------------------------
// Connect middleware packages
// ---------------------------------------------------------------------

app.use(morgan('dev'));     // used for logging information about requests and responses
app.use(cookieParser());    // used for parsing cookies
app.use(express.json());    // used for parsing JSON bodies of requests with `Content-Type` of 'application/json'

  // Security middleware

  // 1. Only allow CORS (Cross-Origin Resource Sharing) in development using the cors middleware
  //    because the React frontend will be served from a different server than the Express server.
  //    CORS isn't needed in production since all of our React and Express resources will come from the same origin.
  // 2. Enable better overall security with the helmet middleware (for more on what helmet is doing, see helmet on the npm registry).
  //    React is generally safe at mitigating XSS (i.e., Cross-Site Scripting) attacks, but do be sure to research how to protect your users
  //    from such attacks in React when deploying a large production application. Now add the crossOriginResourcePolicy to the helmet middleware
  //    with a policy of cross-origin. This will allow images with URLs to render in deployment.
  // 3. Add the csurf middleware and configure it to use cookies.

if (!isProduction) {
    // enable cors only in development
    app.use(cors());    //
}

// helmet helps set a variety of headers to better secure the app
app.use (
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
    // The csurf middleware will add a _csrf cookie that is HTTP-only (can't be read by JavaScript) to any server response.
    // It also adds a method on all requests (req.csrfToken) that will be set to another cookie (XSRF-TOKEN) later on.
    // These two cookies work together to provide CSRF (Cross-Site Request Forgery) protection for your application.
    // The XSRF-TOKEN cookie value needs to be sent in the header of any request with all HTTP verbs besides GET.
    // This header will be used to validate the _csrf cookie to confirm that the request comes from your site and not an unauthorized site.
app.use (
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// ---------------------------------------------------------------------
// Connect routes
// ---------------------------------------------------------------------
const routes = require('./routes');
app.use(routes);

// ---------------------------------------------------------------------
// Error Handling Middleware:
// ---------------------------------------------------------------------

// Resource not found
// Catch unhandled requests and forward to error handler
// NOTE: the underscore prefix on req and res I believe to be to indicate that they aren't used
app.use((_req, _res, next) => {      // Think that the arguments req and res are preceded with _ in order to indicate that they aren't used (but are still required to be there)
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

// Sequelize error handler
// Catch Sequelize errors and format them before sending the error response
// If the error that caused this error-handler to be called is an instance of ValidationError from the sequelize package,
// then the error was created from a Sequelize database validation error and the additional keys of title string and
// errors array will be added to the error and passed into the next error handling middleware.
const { ValidationError } = require('sequelize');   // Import ValidationError class type from sequelize in order to use it to check for this error type in the error handling middleware below

app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

// Error Formatter Error-Handler
// This is for formatting all the errors before returning a JSON response. It will include the error message, the errors array,
// and the error stack trace (if the environment is in development) with the status code of the error message.
// This should be the last middleware in the app.js file of your Express application.
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;
