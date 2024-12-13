const router = require('express').Router();

const sessionRouter = require('./session');
const usersRouter = require('./users');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);


// ------------------------------------------------------------------------------------------------------------
// TESTS ROUTES
// ------------------------------------------------------------------------------------------------------------

// Test route to verify api connection is working
// The API test route is accepting requests with the URL path of /api/test with the HTTP verb of POST.
// It sends a JSON response containing whatever is in the body of the request (echo).

/* Example fetch request to test the /api/test endpoint
fetch('/api/test', {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
    },
    body: JSON.stringify({ hello: 'world' })
    }).then(res => res.json()).then(data => console.log(data));

Replace the <value of XSRF-TOKEN cookie> with the value of the XSRF-TOKEN cookie.
If you don't have the XSRF-TOKEN cookie anymore, access the http://localhost:8000/api/csrf/restore route to add the cookie back.
*/

// // Commented out after testing the custom csrfFetch function in Frontend Phase 0
// router.post('/test', function (req, res) {
//     res.json({message: req.body});
// });

// USER AUTH MIDDLEWARE TESTING ROUTES - COMMENT-IN FOR TESTING PURPOSES
// // TEST ROUTE - GET /api/set-token-cookie - For testing the setTokenCookie middleware defined in utils
/*
Go to http://localhost:5000/api/set-token-cookie and see if there is a token cookie set in your browser's DevTools.
If there isn't, then check your backend server logs in the terminal where you ran npm start.
Also, check the syntax of your setTokenCookie function as well as the test route.
*/
// const asyncHandler = require('express-async-handler');
// const { setTokenCookie } = require('../../utils/auth.js');  // need to connect the middleware function for setTokenCookie
// const { User } = require('../../db/models');                // need to connect the class User model / class
// router.get('/set-token-cookie', asyncHandler(async (_req, res) => {
//     const user = await User.findOne({   // Note that this uses the default scope which limits the info returned (just id & username)
//         where: {
//             username: 'Demo-lition'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({ user });
// }));

// // TEST ROUTE - GET / api/restore-user (middleware call added between route and callback)
// // Tests the restoreUser middleware by connecting the middleware and checking whether or not the req.user key has been populated by the middleware properly.
/*
Go to http://localhost:5000/api/restore-user and see if the response has the demo user information returned as JSON.
Then, remove the token cookie manually in your browser's DevTools and refresh. The JSON response should be empty.
If this isn't the behavior, then check your backend server logs in the terminal where you ran npm start as well as the syntax of your restoreUser middleware and test route.
To set the token cookie back, just go to the GET /api/set-token-cookie route again: http://localhost:5000/api/set-token-cookie.
*/
// const { restoreUser } = require('../../utils/auth.js');
// router.get(
//     '/restore-user',
//     restoreUser,    // this is invoking the restoreUser middleware - note that this middleware queries the DB using the 'currentUser' scope which provides more info than the defualt and sets that onto the req.user key
//     (req, res) => {
//         return res.json(req.user || {message: "No user found"});
//     }
// );

// // TEST ROUTE - GET /api/require-auth
// // If there is no session user, the route will return an error. Otherwise it will return the session user's information.
/*
Set the token cookie back by accessing the GET /api/set-token-cookie route again: http://localhost:5000/api/set-token-cookie.
Go to http://localhost:5000/api/require-auth and see if the response has the demo user's information returned as JSON.
Then, remove the token cookie manually in your browser's DevTools and refresh. The JSON response should now be an "Unauthorized" error.
If this isn't the behavior, then check your backend server logs in the terminal where you ran npm start as well as the syntax of your requireAuth middleware and test route.
To set the token cookie back, just go to the GET /api/set-token-cookie route again: http://localhost:5000/api/set-token-cookie.
*/
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//     '/require-auth',
//     requireAuth,    // this is invoking the restoreUser middleware
//     (req, res) => {
//         return res.json(req.user);
//     }
// );

module.exports = router;
