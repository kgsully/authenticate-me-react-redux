import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Navigation from "./components/Navigation";
// import LoginFormPage from "./components/LoginFormPage";    // Not used for modal version of login page, required if using the non-modal version
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session"

function App() {

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  // Allow user session to persist through refreshes by dispatching restoreUser to fetch session information from JWT token cookie
  // and set it onto the Redux store
  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true))
  }, [dispatch])

  return isLoaded && (    // This forces isLoaded to be true prior to rendering page elements
    <>
      <Navigation isLoaded={isLoaded}/>
      {isLoaded && <section className="content">
        <Switch>
            <Route path="/" exact>
              <h1>Home</h1>
            </Route>
            {/* <Route path="/login">
              <LoginFormPage className="login-form"/>
            </Route> This is necessary if using the non-modal version of the login page*/}
            <Route path="/signup">
              <SignupFormPage className="signup-form"/>
            </Route>
        </Switch>
      </section>}
    </>
  );
}

export default App;
