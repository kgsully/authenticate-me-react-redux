import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from '../../store/session';
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

import './SignupForm.css';

const SignupFormPage = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);   // subscribe to the session.user slice of state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    // If session exists in the Redux store (once signup is complete and a user object is returned), redirect to '/' endpoint
    if(sessionUser) {
        return (
            <Redirect to="/" />
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({username, email, password})) // Why is this returned? All other examples just perform the dispatch, login works without the return...
                .catch(async (res) => {     // This is the .catch in promise .then .catch syntax - login thunk is async and therefore a promise
                    const data = await res.json();
                    if(data && data.errors) setErrors(data.errors);
                })
        }
        return setErrors(['Confirm password field must match password field']);
    }

    return (
        <div className="signup-form-container">
            <h1 className="signup-h1">Sign Up</h1>
            {errors.length > 0 &&
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
            }
            <form className="signup-form" onSubmit={handleSubmit}>
                <p>Username</p>
                <input
                    className="signup-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <p>Email Address</p>
                <input
                    className="signup-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p>Password</p>
                <input
                    className="signup-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p>Confirm Password</p>
                <input
                    className="signup-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="btn-signup" type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default SignupFormPage;
