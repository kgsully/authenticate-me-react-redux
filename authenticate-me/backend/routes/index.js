// Import express package and router function from express
const express = require('express');
const router = express.Router();

// Import and connect api routes
const apiRouter = require('./api');
router.use('/api', apiRouter);


// In development, the backend and frontend servers are separate. In production though, the backend also serves up all the frontend assets,
// including the index.html and any JavaScript files in the frontend/build folder after running npm start in the frontend folder.

// In PRODUCTION, the XSRF-TOKEN will be attached to the index.html file in the frontend/build folder.
// Therefore, the index.html file is served by the backend/routes/index.js file at the / route and any routes that don't start with /api.
// Along with it, the XSRF-TOKEN cookie is attached to the response. Static files in the frontend/build folder are served using the express.static middleware.

// In DEVELOPMENT, another way to get the XSRF-TOKEN cookie on the frontend application is required because the React frontend is on a different server than the Express backend.
// To solve this, the backend route `GET /api/csrf/restore` is added that can only be accessed in development and will restore the XSRF-TOKEN. Note that this functionality was previously
// defined in the test route `GET /hello/world`, but it was not conditioned upon the environment being development. This is not needed in production because the token cookie
// is attached to the response when the index.html file is served.

// Static Routes
// Serve React build files / attach XSRF-TOKEN cookie to response in PRODUCTION
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    // Serve the frontend's index.html file at the root route
    router.get('/', (req, res) => {
        // Set the XSRF-TOKEN cookie on the response
        res.cookie('XSRF-TOKEN', req.csrfToken());  // req.csrfToken() method is part of the csurf package
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'build', 'index.html')
        );
    });

    // Serve the static assets in the frontend's build folder
    router.use(express.static(path.resolve("../frontend/build")));

    // Serve the frontend's index.html file at all other routes NOT starting with /api
    router.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken()); // req.csrfToken() method is part of the csurf package
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'build', 'index.html')
        );
    });
}

// Restore XSRF-TOKEN in DEVELOPMENT
if (process.env.NODE_ENV !== 'production') {
    router.get('/api/csrf/restore', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());  // req.csrfToken() method is part of the csurf package

        // Return empty JSON as the function of this route is for setting the XSRF-TOKEN cookie on the response.
        // res.json sets the response / status code, etc as is required
        return res.json({});
    });
}

// Test Route - Sets a cookie on the response with the name of XSRF-TOKEN to the value of the req.csrfToken method's return
// router.get('/hello/world', function (req, res) {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.send('Hello World!');
// });

module.exports = router;
