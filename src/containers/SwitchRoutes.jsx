import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/views/NotFound'
import TermsAndConditions from '../components/views/TermsAndConditions'
import PrivacyPolicy from '../components/views/PrivacyPolicy'
import LandingPage from "views/LandingPage/LandingPage.js"
import UserProfilePage from 'components/pages/UserProfilePage'
import HomePage from 'components/pages/HomePage'
import AvalSolicitudPage from 'components/pages/AvalSolicitudPage'
import AvalViewPage from 'components/pages/AvalViewPage';
import AvalEditPage from 'components/pages/AvalEditPage'
import UsersPage from 'components/pages/UsersPage'
import UserEditPage from 'components/pages/UserEditPage'
import AboutPage from 'components/pages/AboutPage'
import MisAvalesPage from 'components/pages/MisAvalesPage'
import MisInversionesPage from 'components/pages/MisInversionesPage'
import FaqPage from 'components/pages/FaqPage'

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
            path="/about"
            render={props => (
                <AboutPage/>
            )}
        />
        <Route
            exact
            path="/faq"
            render={props => (
                <FaqPage/>
            )}
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
                <MisAvalesPage {...props} />
            } />
        <Route path="/mis-inversiones"
            render={props =>
                <MisInversionesPage {...props} />
            } />
        {/*<Route path="/" render={props => <LandingPage {...props} />} />*/}
        <Route path="/"
            render={props => <HomePage
                key={currentUser ? currentUser.id : 0}
                {...props}
            />} />
        <Route path="/landing-page" render={props => <LandingPage {...props} />} />
        <Route component={NotFound} />
    </Switch>
);

export default SwitchRoutes;