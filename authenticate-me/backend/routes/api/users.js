// USERS ROUTES
// Signup: POST /api/users

const express = require('express');

// Not sure why the asyncHandler is necessary, previous exercise just used async instead of the async handler...
// const asyncHandler = require('express-async-handler');  // The asyncHandler function from express-async-handler will wrap asynchronous route handlers and custom middlewares.

// Attach auth middleware and Users model class
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

// Attach express-validator and handleValidationErrors middleware
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validating Signup Request Body - validateSignup middleware
// The check function from express-validator will be used with the handleValidationErrors to validate the body of a request.
// The POST /api/users signup route will expect the body of the request to have keys of username, email, and password of the user being created

// The validateSignup middleware is composed of the check and handleValidationErrors middleware.
// It checks to see if req.body.email exists and is an email, req.body.username is a minimum length of 4 and is not an email,
// and req.body.password is not empty and has a minimum length of 6. If at least one of the req.body values fail the check, an error will be returned as the response.
const validateSignup = [
  check('email', 'Please provide a valid email.') // message can be specified as the 2nd parameter of the check
      .exists({ checkFalsy: true })
      .bail() // .bail() will prevent the check from continuing and duplicating error messages
      .isEmail(),
      // .withMessage('Please provide a valid email.'),
  check('username', 'Please provide a username with at least 4 characters.')
      .exists({ checkFalsy: true })
      .bail()
      .isLength({ min: 4 }),
      // .withMessage('Please provide a username with at least 4 characters.'),
  check('username', 'Username cannot be an email.')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
  check('password', 'Password must be 6 characters or more.')
      .exists({ checkFalsy: true })
      .bail()
      .isLength({ min: 6 }),
      // .withMessage('Password must be 6 characters or more.'),

  handleValidationErrors
];

// Signup API route (asynchronous)
// Calls the signup static method on the User model.
// If the user is successfully created, call setTokenCookie and return a JSON response with the user information.
// If the creation is unsuccessful, a sequelize validation error will be passed onto the next error-handling middleware
// NOTE ---> USES validateSignup MIDDLEWARE TO VALIDATE REQUEST BODY. SEE COMMENTS / CODE FOR MORE INFORMATION
router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { username, email, password } = req.body;
        const user = await User.signup({username, email, password});

        await setTokenCookie(res, user);

        return res.json({user});
    }
);

module.exports = router;

// -------------------------------------------------------------------------------------------------
// Testing Notes:
// -------------------------------------------------------------------------------------------------

// ---------------------------
// Signup Route
// ---------------------------
/*
Test the signup route by navigating to the http://localhost:5000/hello/world test route and making a fetch request from the browser's DevTools console. Remember, you need to pass in the value of the XSRF-TOKEN cookie as a header in the fetch request because the login route has a POST HTTP verb.

If at any point you don't see the expected behavior while testing, check your backend server logs in the terminal where you ran npm start. Also, check the syntax in the users.js route file as well as the signup method in the user.js model file.

Try to signup a new valid user.

fetch('/api/users', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
  },
  body: JSON.stringify({
    email: 'spidey@spider.man',
    username: 'Spidey',
    password: 'password'
  })
}).then(res => res.json()).then(data => console.log(data));

Remember to replace the <value of XSRF-TOKEN cookie> with the value of the XSRF-TOKEN cookie found in your browser's DevTools. If you don't have the XSRF-TOKEN cookie anymore, access the http://localhost:5000/hello/world route to add the cookie back.

Next, try to hit the Sequelize model validation errors by testing the following which should give back a Validation error:

    email is not unique (signup with an existing email)
    username is not unique (signup with an existing username)

If you don't see the Validation error for any of these, check the syntax in your backend/db/models/user.js model file.
*/

// ---------------------------
// Signup Validation
// ---------------------------
/*
Test validateSignup by navigating to the http://localhost:5000/hello/world test route and making a fetch request from the browser's DevTools console. Remember, you need to pass in the value of the XSRF-TOKEN cookie as a header in the fetch request because the login route has a POST HTTP verb.

If at any point you don't see the expected behavior while testing, check your backend server logs in the terminal where you ran npm start. Also, check the syntax in the users.js route file as well as the handleValidationErrors middleware.

First, test the signup route with an empty password field. You should get a Bad Request error back with 'Please provide a password' as one of the errors.

fetch('/api/users', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
  },
  body: JSON.stringify({
    email: 'firestar@spider.man',
    username: 'Firestar',
    password: ''
  })
}).then(res => res.json()).then(data => console.log(data));

Remember to replace the <value of XSRF-TOKEN cookie> with the value of the XSRF-TOKEN cookie found in your browser's DevTools. If you don't have the XSRF-TOKEN cookie anymore, access the http://localhost:5000/hello/world route to add the cookie back.

Then try to sign up with more invalid fields to test out the checks in the validateSignup middleware. Make sure to cover each of the following test cases which should give back a Bad Request error:

    email field is an empty string
    email field is not an email
    username field is an empty string
    username field is only 3 characters long
    username field is an email
    password field is only 5 characters long

If you don't see the Bad Request error for any of these, check your syntax for the validateSignup middleware.
*/
