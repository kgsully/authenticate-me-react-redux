// SESSION ROUTES:
// Login: POST /api/session
// Logout: DELETE /api/session
// Get session user: GET /api/session

const express = require('express');
// Not sure why the asyncHandler is necessary, previous exercise just used async instead of the async handler...
// const asyncHandler = require('express-async-handler');  // The asyncHandler function from express-async-handler will wrap asynchronous route handlers and custom middlewares.

// Attach auth middleware and Users model class
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

// Attach express-validator and handleValidationErrors middleware
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validating Login Request Body - validateLogin middleware
// The check function from express-validator will be used with the handleValidationErrors to validate the body of a request.
// The POST /api/session login route will expect the body of the request to have a key of credential with either
// the username or email of a user and a key of password with the password of the user.

// The validateLogin middleware is composed of the check and handleValidationErrors middleware.
// It checks to see whether or not req.body.credential and req.body.password are empty. If one of them is empty, then an error will be returned as the response.
const validateLogin = [
  check('credential', 'Please provide a valid email or username.')  // message can be specified as the 2nd parameter of the check
      .exists({ checkFalsy: true })
      .bail() // .bail() will prevent the check from continuing and duplicating error messages
      .notEmpty(),
      // .withMessage('Please provide a valid email or username.'),
  check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password'),

  handleValidationErrors  // call the handleValidationErrors middleware after all checks have occured
];



// Login route:
// Using an asynchronous route handler, call the login static method from the User model.
// If a user is returned from the login static method, call setTokenCookie and return a JSON response with the user info
// If no user is returned, create a "Login Failed" error and invoke the next error-handling middleware with it
// NOTE ---> USES validateLogin MIDDLEWARE TO VALIDATE REQUEST BODY. SEE COMMENTS / CODE FOR MORE INFORMATION
router.post(
    '/',
    validateLogin,  // invoke the validateLogin middleware prior to handling the route
    async (req, res, next) => {     // if using the express asyncHandler -> asyncHandler(async (req, res, next) => {  // DON'T FORGET THE CLOSING ) if using this syntax!
      const { credential, password } = req.body;
      console.log(password);

      const user = await User.login({ credential, password });

      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }

      await setTokenCookie(res, user);

      return res.json({
        user
      });
    }
);

// Logout route:
// The DELETE /api/session logout route will remove the token cookie from the response (i.e. ending the session and removing auth)
// and return a JSON success message
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({message: "Success"});
    }
);

// Get Session User route:
// Uses the restoreUser middleware and will return the session user as JSON under the key of user (toSafeObject as the restoreUser method uses the currentUser scope).
// If there is not a session (i.e. no JWT session cookie), it will return a JSON with an empty object.
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if(user) {
      return res.json({ user: user.toSafeObject() });
    } else {
      return res.json({});
    }
  }
);

module.exports = router;

// -------------------------------------------------------------------------------------------------
// Testing Notes:
// -------------------------------------------------------------------------------------------------

// ---------------------------
// Login Route
// ---------------------------
/*
Test the login route by navigating to the http://localhost:5000/hello/world test route and making a fetch request from the browser's DevTools console. Remember, you need to pass in the value of the XSRF-TOKEN cookie as a header in the fetch request because the login route has a POST HTTP verb.

If at any point you don't see the expected behavior while testing, then check your backend server logs in the terminal where you ran npm start. Also, check the syntax in the session.js as well as the login method in the user.js model file.

Try to login the demo user with the username first.

fetch('/api/session', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
  },
  body: JSON.stringify({ credential: 'Demo-lition', password: 'password' })
}).then(res => res.json()).then(data => console.log(data));

Remember to replace the <value of XSRF-TOKEN cookie> with the value of the XSRF-TOKEN cookie found in your browser's DevTools. If you don't have the XSRF-TOKEN cookie anymore, access the http://localhost:5000/hello/world route to add the cookie back.

Then try to login the demo user with the email next.

fetch('/api/session', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
  },
  body: JSON.stringify({ credential: 'demo@user.io', password: 'password' })
}).then(res => res.json()).then(data => console.log(data));

Now test an invalid user credential and password combination.

fetch('/api/session', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
  },
  body: JSON.stringify({ credential: 'Demo-lition', password: 'Hello World!' })
}).then(res => res.json()).then(data => console.log(data));

You should get a Login failed error back with an invalid password for the user with that credential.

Commit your code for the login route once you are done testing!
*/

// ---------------------------
// Validate Login
// ---------------------------
/*
Test validateLogin by navigating to the http://localhost:5000/hello/world test route and making a fetch request from the browser's DevTools console. Remember, you need to pass in the value of the XSRF-TOKEN cookie as a header in the fetch request because the login route has a POST HTTP verb.

If at any point you don't see the expected behavior while testing, check your backend server logs in the terminal where you ran npm start. Also, check the syntax in the users.js route file as well as the handleValidationErrors middleware.

Try setting the credential user field to an empty string. You should get a Bad Request error back.

fetch('/api/session', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
  },
  body: JSON.stringify({ credential: '', password: 'password' })
}).then(res => res.json()).then(data => console.log(data));

Remember to replace the <value of XSRF-TOKEN cookie> with the value of the XSRF-TOKEN cookie found in your browser's DevTools. If you don't have the XSRF-TOKEN cookie anymore, access the http://localhost:5000/hello/world route to add the cookie back.

Test the password field by setting it to an empty string. You should get a Bad Request error back with Please provide a password as one of the errors.

fetch('/api/session', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
  },
  body: JSON.stringify({ credential: 'Demo-lition', password: '' })
}).then(res => res.json()).then(data => console.log(data));
*/

// ---------------------------
// Logout Route
// ---------------------------
/*
Start by navigating to the http://localhost:5000/hello/world test route and making a fetch request from the browser's DevTools console to test the logout route. Check that you are logged in by confirming that a token cookie is in your list of cookies in the browser's DevTools. Remember, you need to pass in the value of the XSRF-TOKEN cookie as a header in the fetch request because the logout route has a DELETE HTTP verb.

Try to logout the session user.

fetch('/api/session', {
  method: 'DELETE',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
  }
}).then(res => res.json()).then(data => console.log(data));

You should see the token cookie disappear from the list of cookies in your browser's DevTools. If you don't have the XSRF-TOKEN cookie anymore, access the http://localhost:5000/hello/world route to add the cookie back.

If you don't see this expected behavior while testing, then check your backend server logs in the terminal where you ran npm start as well as the syntax in the session.js route file.
*/

// ---------------------------
// Get Session User Route
// ---------------------------
/*
Test the route by navigating to http://localhost:5000/api/session. You should see the current session user information if you have the token cookie. If you don't have a token cookie, you should see an empty object returned.

If you don't have the XSRF-TOKEN cookie anymore, access the http://localhost:5000/hello/world route to add the cookie back.

If you don't see this expected behavior, then check your backend server logs in your terminal where you ran npm start and the syntax in the session.js route file and the restoreUser middleware function.

Commit your code for the get session user route once you are done testing!
*/
