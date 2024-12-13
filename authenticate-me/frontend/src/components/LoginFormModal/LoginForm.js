import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

import './LoginForm.css';

// Login form function component
// Input fields set as controlled components. Upon form submittal, dispatch session thunk action to perform login function
// capture errors using the .then .catch syntax and set the errors onto the state variable in an array
const LoginForm = () => {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const updateCredential = (e) => setCredential(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

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
                <button type="submit" className="btn-login">Log In</button>
            </form>
        </div>
    )
}

export default LoginForm;
