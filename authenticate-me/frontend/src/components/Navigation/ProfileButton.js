import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session'


// When clicked, the profile button should trigger a component state change and cause a dropdown menu to be rendered.
// When there is a click outside of the dropdown menu list or on the profile button again, then the dropdown menu should disappear.
// This is accomplished using a state variable associated with showing the menu.
// The dropdown menu closes when anywehere outside the dropdown menu is clicked. An event listener (click action) associated with
// the entire document triggers a callback which sets the show menu state variable to false. The event listener is removed during the cleanup phase of the useEffect hook
const ProfileButton = (props) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const {username, email} = props.user;

    const openMenu = () => {
        if(showMenu) return;
        setShowMenu(true);
    }

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    }

    useEffect(() => {
        if(!showMenu) return;

        const closeMenu = () => setShowMenu(false);

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);

    }, [showMenu]);

    return(
        <>
            <button className="profile-button" onClick={openMenu}>
                <i className="fas fa-user-circle"></i>
            </button>
            {showMenu && (
                <div className="profile-menu">
                    <ul>
                        <li>{username}</li>
                        <li>{email}</li>
                    </ul>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </>
    );
}

export default ProfileButton;

/*
Font Awesome Notes:

Follow the instructions here (https://fontawesome.com/start) for setting up Font Awesome.
The easiest way to connect Font Awesome to your React application is by sharing your email and creating a new kit.
The kit should let you copy an HTML <script>. Add this script to the <head> of your frontend/public/index.html file.

If you don't want to signup for Font Awesome and are okay with using Font Awesome icons that may not be up to date,
you can just add the following link to the <head> of your frontend/public/index.html file:

<link
  rel="stylesheet"
  href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
  integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
  crossorigin="anonymous" />

Now you can use any of the free icons available in Font Awesome (https://fontawesome.com/icons?d=gallery&m=free) by adding the <i> element with the desired className to ber rendered in a React component.
To change the size or color of the icon, wrap the <i> element in a parent element like a div. Manipulating the font-size of the parent element changes the size of the icon.
The color of the parent element will be the color of the icon. For example, to render a big orange carrot icon (https://fontawesome.com/icons/carrot?style=solid&s=solid):

const Carrot = () => (
  <div style={{ color: "orange", fontSize: "100px" }}>
    <i className="fas fa-carrot"></i>
  </div>
);
*/
