import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/views/NotFound'
import TermsAndConditions from '../components/views/TermsAndConditions'
import PrivacyPolicy from '../components/views/PrivacyPolicy'
import LandingPage from "views/LandingPage/LandingPage.js"
import LoginPage from "views/LoginPage/LoginPage.js"
import UserProfilePage from 'components/UserProfilePage'

import Home from 'components/views/Home'
import AvalSolicitudPage from 'components/views/AvalSolicitudPage'
import AvalViewPage from 'components/views/AvalViewPage';
import AvalEditPage from 'components/views/AvalEditPage'
import UsersPage from 'components/views/UsersPage'
import UserEditPage from 'components/UserEditPage'
import MisAvales from 'components/views/MisAvales'

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
                <UserProfilePage />
            )}
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
            path="/aval/:avalId/view"
            render={props => (
                <AvalViewPage
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/aval/:avalId/edit"
            render={props => (
                <AvalEditPage
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/aval/solicitud"
            render={props => (
                <AvalSolicitudPage
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route path="/mis-avales"
            render={props =>
                <MisAvales {...props} />
            } />
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