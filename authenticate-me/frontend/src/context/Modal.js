// The context folder holds all the different context and context providers for the application
// This file contains the context for a modal element

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

// Create React context to be used for the modal.
// A state variable value for the context provider gets set to a React ref that gets created (and is subsequently assigned to Provider's sibling <div>).
// The context is referenced by the portal created by the modal function component as the DOM node upon which the modal should go
export const ModalContext = createContext();

// Modal React context provider
// This context provider function component is used to wrap all React elements in the entry index.js in the Root() component.
// A React ref is created that is assigned to the context Provider's sibling <div>. The ref then stores a reference to this div as it's 'current' value
// (like a pointer to the div, similar to document.querySelector or document.getElementById).
// This is the location that will be referenced as the DOM node where the React portal will 'physically' put the JSX passed into it for rendering.
export const ModalProvider = ({children}) => {
    const modalRef = useRef(null);
    const [value, setValue] = useState(null);

    useEffect(() => {
        setValue(modalRef.current);
    }, []);

    return (
        <>
            <ModalContext.Provider value={value}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef} />
        </>
        );
}

// Modal Element
// The React createPortal method allows for the rendering of some children into a different part of the DOM.
// This functionality allows for modals to be created in React.

// Function component for the modal element. It expects onClose and children to be passed in as props.
// When the modal-background is clicked, the onClose prop should be invoked. modalNode is passed in as the second argument
// to createPortal to define where the children should be rendered. modalNode uses the React Context that was set by the provider
// to the Provider's sibling <div>. As such, the contents of the JSX passed to createPortal as the first argument will be rendered in
// the Provider's sibling <div>.

// Note that the modal-background div needs to be rendered before the modal-content because it will naturally
// be placed "behind" the depth of the modal-content if it comes before the modal-content in the DOM tree.
export const Modal = ({onClose, children}) => {
    const modalNode = useContext(ModalContext);
    if (!modalNode) return null;

    return createPortal(
        <div id="modal">
            <div id="modal-background" onClick={onClose} />
            <div id="modal-content">
                {children}
            </div>
        </div>,
        modalNode
    );
}
