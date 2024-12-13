import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

import './LoginForm.css';

// Login form function component
// Input fields set as controlled components. Upon form submittal, dispatch session thunk action to perform login function
// capture errors using the .then .catch syntax and set the errors onto the state variable in an array
const LoginFormPage = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);   // subscribe to the session.user slice of state
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const updateCredential = (e) => setCredential(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

    // If session exists in the Redux store, redirect user to '/'
    if(sessionUser) return (
        <Redirect to="/" />
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);

        return dispatch(sessionActions.login({credential, password}))   // Why is this returned? All other examples just perform the dispatch, login works without the return...
            .catch(async (res) => {     // This is the .catch in promise .then .catch syntax - login thunk is async and therefore a promise
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    }

    return (
        <div className="login-form-container">
            <h1 className="login-h1">Log In</h1>
            {errors.length > 0 &&
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
            }
            <form className="login-Form" onSubmit={handleSubmit}>
                <p>Username or Email Address</p>
                <input
                    className="login-input"
                    type="text"
                    value={credential}
                    onChange={updateCredential} />
                <p>Password</p>
                <input
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={updatePassword} />
                <button className="btn-login">Log In</button>
            </form>
        </div>
    )
}

export default LoginFormPage;
