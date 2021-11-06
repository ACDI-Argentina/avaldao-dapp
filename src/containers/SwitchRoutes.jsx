import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Profile from '../components/views/Profile'
import EditProfile from '../components/views/EditProfile'
import ViewMilestone from '../components/views/ViewMilestone'
import EditDAC from '../components/views/EditDAC'
import ViewDAC from '../components/views/ViewDAC'
import MyDACs from '../components/views/MyDACs'
import MyCampaigns from '../components/views/MyCampaigns'
import MyMilestones from '../components/views/MyMilestones'
import NotFound from '../components/views/NotFound'
import Campaigns from '../components/views/Campaigns'
import DACs from '../components/views/DACs'
import TermsAndConditions from '../components/views/TermsAndConditions'
import PrivacyPolicy from '../components/views/PrivacyPolicy'
import EditCampaign from '../components/views/EditCampaign'
import ViewCampaign from '../components/views/ViewCampaign'
import EditMilestone from '../components/views/EditMilestone'
import LandingPage from "views/LandingPage/LandingPage.js"
import LoginPage from "views/LoginPage/LoginPage.js"
import AvalCompletar from 'components/views/AvalCompletar'
import Avales from 'components/views/Avales'
import UserProfile from 'components/UserProfile'
import ViewAval from 'components/views/aval/ViewAval';

const SwitchRoutes = ({ currentUser }) => (
    <Switch>

        {/*NOTE order matters, wrong order breaks routes!*/}
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
            path="/dacs/new"
            render={props => (
                <EditDAC
                    isNew
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/dacs/:id"
            render={props => (
                <ViewDAC
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/dacs/:id/edit"
            render={props => (
                <EditDAC
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />

        <Route
            exact
            path="/campaigns/new"
            render={props => (
                <EditCampaign
                    isNew
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/campaigns/:id"
            render={props => (
                <ViewCampaign
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/campaigns/:id/edit"
            render={props => (
                <EditCampaign
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />

        <Route
            exact
            path="/campaigns/:id/milestones/new"
            render={props => (
                <EditMilestone
                    isNew
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/campaigns/:id/milestones/propose"
            render={props => (
                <EditMilestone
                    isNew
                    isProposed
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/campaigns/:id/milestones/:milestoneId"
            render={props => (
                <ViewMilestone
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/campaigns/:id/milestones/:milestoneId/edit/proposed"
            render={props => (
                <EditMilestone
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    isProposed
                    {...props}
                />
            )}
        />

        <Route
            exact
            path="/campaigns/:id/milestones/:milestoneId/edit"
            render={props => (
                <EditMilestone
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/campaigns/:id/milestones"
            render={({ match }) => (
                <Redirect to={`/campaigns/${match.params.id}`} />
            )}
        />
        <Route
            exact
            path="/milestones/:milestoneId/edit"
            render={props => (
                <EditMilestone
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/milestones/:milestoneId/edit/proposed"
            render={props => (
                <EditMilestone
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    isProposed
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/my-dacs"
            render={props => (
                <MyDACs
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/my-campaigns"
            render={props => (
                <MyCampaigns
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/my-milestones"
            render={props => (
                <MyMilestones
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />
        {/*<Route
            exact
            path="/profile"
            render={props => (
                <EditProfile
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />*/}
        <Route
            exact
            path="/profile"
            render={props => (
                <UserProfile />
            )}
        />
        <Route
            exact
            path="/avales"
            render={props => (
                <Avales
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/avales/:id"
            render={props => (<ViewAval {...props}/>
            )}
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
        <Route
            exact
            path="/profile/:userAddress"
            render={props => <Profile {...props} />}
        />

        {/*<Route path="/" render={props => <LandingPage {...props} />} />*/}
        <Route path="/"
            render={props => <Avales
                key={currentUser ? currentUser.id : 0}
                {...props}
            />} />

        {/*<Route
            exact
            path="/"
            render={props => <Explore {...props} />}
        />*/}
        <Route
            exact
            path="/campaigns"
            render={props => <Campaigns {...props} />}
        />
        <Route
            exact
            path="/dacs"
            render={props => <DACs {...props} />}
        />

        {/* Other material react routes. Not used*/})
        <Route path="/landing-page" render={props => <LandingPage {...props} />} />
        <Route path="/login-page" component={LoginPage} />



        <Route component={NotFound} />
    </Switch>
);

export default SwitchRoutes;