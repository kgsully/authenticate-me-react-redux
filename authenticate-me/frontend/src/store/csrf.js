// js-cookie module is used to extract the XSRF-TOKEN cookie value from the request
import Cookies from 'js-cookie';

// The Express backend server is configured to be CSRF protected and will only accept requests that have the right CSRF secret token
// in the header and the right CSRF token value in a cookie.
// Therefore in order to make fetch requests with any HTTP verb other than 'GET' the XSRF-TOKEn header must be set on the request, and the value of the header
// should be set to the value of the XSRF-TOKEN cookie. To accomplish this, the `fetch` function on the window will be wrapped in a function that will
// be used in place of the default fetch function.
export async function csrfFetch(url, options = {}) {
    // Set options.method to 'GET' if there is no method defined
    options.method = options.method || 'GET';
    // Set options.headers to an empty object if there are no headers defined
    options.headers = options.headers || {};

    // If the options.method is not 'GET', then set the "Content-Type" header to the defined content type OR "application/json" if it is not defined
    // Additionally, set the "XSRF-TOKEN" header to the value of the "XSRF-TOKEN" cookie
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
    }

    // Call the standard window.fetch with the passed in url and options passed in / defined within this function
    const res = await window.fetch(url, options);

    // if the response status code is 400 or above, then throw an error with the error being the response
    if (res.status >= 400) throw res;

    // if the response status code is under 400, then return the response to the next promise chain
    if (res.status < 400) return res;
}

// The `GET /api/csrf/restore` function needs to be called when the application is loaded when in development.
// This will be accomplished by making a fetch call to the backend route `/api/csrf/restore`.
// No options are specified as this will be a GET call with the sole intention of getting the XSRF-TOKEN
export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}

// -------------------------------------------------------------------------------------------------
// Testing Notes:
// -------------------------------------------------------------------------------------------------

// ---------------------------
// Custom csrfFetch with CSRF
// ---------------------------
/*
To test the custom csrfFetch function that attaches the CSRF token to the header, navigate to root route of the React application,
http://localhost:3000. In the browser's dev tools console, make a request to POST /api/session to login (and verify the JWT),
and then /api/test with the demo user credentials using the window.csrfFetch function.
There is no need to specify the headers because the default header for "Content-Type", set to "application/json" (in the csrfFetch function),
and the "XSRF-TOKEN" header are added by the custom csrfFetch.

window.csrfFetch('/api/test', {
  method: 'POST',
  body: JSON.stringify({ credential: 'Demo-lition', password: 'password' })
}).then(res => res.json()).then(data => console.log(data));

If you see an object with a key of requestBody logged in the terminal with the value as the object that you passed into the
body of the request, then you successfully set up CSRF protection on the frontend.
If you don't then check your syntax in the frontend/src/store/csrf.js and the frontend/src/index.js.
*/
