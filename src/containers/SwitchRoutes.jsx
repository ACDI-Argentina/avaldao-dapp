import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/views/NotFound'
import TermsAndConditions from '../components/views/TermsAndConditions'
import PrivacyPolicy from '../components/views/PrivacyPolicy'
import LandingPage from "views/LandingPage/LandingPage.js"
import LoginPage from "views/LoginPage/LoginPage.js"
import UserProfilePage from 'components/UserProfilePage'
import AvalView from 'components/views/AvalView';
import Home from 'components/views/Home'
import AvalSolicitud from 'components/views/AvalSolicitud'
import UsersPage from 'components/views/UsersPage'
import UserEditPage from 'components/UserEditPage'
import Workspace from 'components/views/Workspace'

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
                <AvalView
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/aval/solicitud"
            render={props => (
                <AvalSolicitud
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route path="/workspace"
            render={props =>
                <Workspace {...props} />
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