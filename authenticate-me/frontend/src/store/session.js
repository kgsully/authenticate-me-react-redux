import { csrfFetch } from './csrf';

const SET_SESSION_USER = 'session/SET_SESSION_USER';
const REMOVE_SESSION_USER = 'session/REMOVE_SESSION_USER';

// Action to set user session info to the store upon successful login
export const setUser = (user) => ({
    type: SET_SESSION_USER,
    user
});

// Action to remove the user session info from the store upon logout
const removeUser = () => ({
    type: REMOVE_SESSION_USER
});

// Thunk action to call the csrfFetch function to make a POST request to the backend /api/session route
// to log in the user. csrfFetch is used instead of a standard fetch call as the XSRF-TOKEN must be included
// as the method is not GET and will be rejected by the backend without the token included.
// The POST / api/session route expects the request body to have a key of credential with an existing username or email
// and a key of password. After the response from the AJAX call comes back, the JSON body of the response is parsed
// and then dispatched to the action for setting the session user to the user in the response's body.
export const login = (loginInfo) => async (dispatch) => {
    const { credential, password } = loginInfo;
    const response = await csrfFetch('/api/session', {
        method: "POST",
        body: JSON.stringify({
            credential,
            password
        })
    });

    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

// In order to allow for a user session to be restored (navigating to the site again, or to persist through a refresh),
// the restoreUser thunk action creator fetches the route 'GET /api/session', then dispatches the response user data to
// the setUser action creator to be applied to the store
export const restoreUser = () => async (dispatch)=> {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user || null));
    return response;
}

// Thunk action to handle sign ups. This thunk action creator deconstructs the signup info provided by the user,
// then calls the csrfFetch with a POST request to the endpoint /api/users on the backend.
// Once the response from the AJAX call comes back, it will parse the JSON body of the response, and dispatch the action
// to set the session user received in the response's body
export const signup = (signupInfo) => async (dispatch) => {
    const { username, email, password } = signupInfo;
    const response = await csrfFetch('/api/users', {
        method: "POST",
        body: JSON.stringify({
            username,
            email,
            password
        })
    });
    const data = await response.json();
    if (data.user) {
        dispatch(setUser(data.user));
    }
    return response;
}

// Thunk action to handle logout. This thunk action creator hits the DELETE /api/session route to log a user out.
// After the response from the AJAX call comes back, dispatches the action for removing the session user.
export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: "DELETE"
    });
    const data = await response.json();
    if (data.message === 'Success') {
        dispatch(removeUser());
    }
    return response;
}

const initialState = { user: null };

function sessionReducer (state = initialState, action) {
    let newState = Object.assign({}, state);
    switch(action.type) {
        case SET_SESSION_USER:
            newState.user = action.user
            return newState;
        case REMOVE_SESSION_USER:
            newState.user = null;
            return newState;
        default:
            return state;
    }
}

export default sessionReducer;
