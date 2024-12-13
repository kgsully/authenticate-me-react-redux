import { useState } from "react";
import LoginForm from "./LoginForm";
import { Modal } from "../../context/Modal";
import './LoginForm.css';

// Modal Login Form Function Component
// Use a state variable to track whether modal should be shown or not.
// Render a login button. Additionally, render the Modal function component with the login form as it's child only when
// the state of the showModal state variable is true.
// A prop of onClose is passed to the Modal function component which is assigned to a function that will use the
// state variable change function to set the value to false when invoked
const LoginFormModal = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className="modal-login-button" onClick={() => {setShowModal(true)}}>Log In</button>
            {showModal &&
                <Modal onClose={() => setShowModal(false)}>
                    <LoginForm />
                </Modal>
            }
        </>
    );
}

export default LoginFormModal;
