import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

// Navigation Header
// The navigation functional component renders an unordered list with a navigation link to the home page.
// It should only contain navigation links to the login and signup routes when there is no session user and a logout button when there is.
const Navigation = ({isLoaded}) => {
    const sessionUser = useSelector((state) => state.session.user);
    let sessionLinks;

    if(sessionUser) {
        sessionLinks = (
            <ProfileButton user={sessionUser} />
        );
    } else {
        sessionLinks = (
            <div>
                {/* <NavLink to="/login">Login</NavLink> This is a link to the non-modal version of the login page */}
                <LoginFormModal />
                <NavLink to="/signup">Sign Up</NavLink>
            </div>
        );
    }

    return (
        <div className="navbar">
            <NavLink to="/">Home</NavLink>
            {isLoaded && sessionLinks}
        </div>
    );
}

export default Navigation;
