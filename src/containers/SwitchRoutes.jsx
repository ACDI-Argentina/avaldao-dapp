import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Profile from '../components/views/Profile'
import NotFound from '../components/views/NotFound'
import TermsAndConditions from '../components/views/TermsAndConditions'
import PrivacyPolicy from '../components/views/PrivacyPolicy'
import LandingPage from "views/LandingPage/LandingPage.js"
import LoginPage from "views/LoginPage/LoginPage.js"
import AvalCompletar from 'components/views/AvalCompletar'
import UserProfile from 'components/UserProfile'
import AvalView from 'components/views/AvalView';
import Home from 'components/views/Home'
import AvalSolicitar from 'components/views/AvalSolicitar'
import UsersPage from 'components/views/UsersPage'
import UserEditPage from 'components/UserEditPage'

const SwitchRoutes = ({ currentUser }) => (
    <Switch>
        <Route
            exact
            path="/termsandconditions"
            render={props => <TermsAndConditions {...props} />}
        />
        <Route
            exact
            path="/privacypolicy"
            render={props => <PrivacyPolicy {...props} />}
        />
        <Route
            exact
            path="/profile"
            render={props => (
                <UserProfile />
            )}
        />
        <Route
            exact
            path="/profile/:userAddress"
            render={props => <Profile {...props} />}
        />
        <Route
            exact
            path="/users"
            render={props => (
                <UsersPage
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/user/:userAddress/edit"
            render={props => (
                <UserEditPage
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/aval/:id"
            render={props => (
                <AvalView
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/solicitar-aval"
            render={props => (
                <AvalSolicitar
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />

        <Route
            exact
            path="/request-aval"
            render={props => (
                <AvalSolicitar
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/profile/:userAddress"
            render={props => <Profile {...props} />}
        />
        <Route
            exact
            path="/aval-completar/:id"
            render={props => (
                <AvalCompletar
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        {/*<Route path="/" render={props => <LandingPage {...props} />} />*/}
        <Route path="/"
            render={props => <Home
                key={currentUser ? currentUser.id : 0}
                {...props}
            />} />
        <Route path="/landing-page" render={props => <LandingPage {...props} />} />
        <Route path="/login-page" component={LoginPage} />
        <Route component={NotFound} />
    </Switch>
);

export default SwitchRoutes;