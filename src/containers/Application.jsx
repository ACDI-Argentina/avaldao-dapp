import React, { Component } from 'react';

import { Router } from 'react-router-dom';
import localforage from 'localforage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import GoogleAnalytics from 'lib/GoogleAnalytics';
import { ScrollToTop } from '../lib/helpers';
import config from '../configuration';
import { ErrorBoundary, history, NavigateAnchor } from '@acdi/efem-dapp';
/* import '../lib/validators'; */
import { connect } from 'react-redux'
import { fetchAvalesOnChain, fetchAvalesOffChain } from '../redux/reducers/avalesSlice'
import { fetchFondoGarantia } from '../redux/reducers/fondoGarantiaSlice'
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import { fetchUsers } from '../redux/reducers/usersSlice';
import { fetchExchangeRates } from '../redux/reducers/exchangeRatesSlice'
import MessageViewer from '../components/MessageViewer';
import SwitchRoutes from './SwitchRoutes';
import initExchangeRateListener from "../lib/blockchain/listeners/exchangeRateListener"
import TransactionViewer from 'components/TransactionViewer';
import Web3Banner from 'lib/blockchain/Web3Banner';
import Web3App from 'lib/blockchain/Web3App';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { Route } from 'react-router-dom';


function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'none';
  }
}

/**
 * This container holds the application and its routes.
 * It is also responsible for loading application persistent data.
 * As long as this component is mounted, the data will be persistent,
 * if passed as props to children.
 * -> moved to data to UserProvider
 */
class Application extends Component {
  constructor(props) {
    super(props);

    localforage.config({
      name: 'dapp',
    });

    this.state = {};
  }

  componentDidMount() {
    hidePreloader();
    this.props.fetchAvalesOnChain();
    this.props.fetchAvalesOffChain();
    this.props.fetchExchangeRates();
    this.props.fetchFondoGarantia();
    initExchangeRateListener();
  }

  render() {
    const { currentUser } = this.props;

    NavigateAnchor(history);

    return (
      <ErrorBoundary>
        <Web3App>
          <Web3App.Consumer>
            {({
              network,
              walletBrowserRequired,
              lastNotificationTs
            }) => (
              <>
                <TransactionViewer />
                <MessageViewer />
                <Router history={history} >
                  <ScrollToTop />
                  <div>
                    <Route render={() => <GoogleAnalytics />} />

                    <SwitchRoutes currentUser={currentUser} />

                    <ToastContainer
                      position="top-right"
                      type="default"
                      autoClose={5000}
                      newestOnTop={true}
                      closeOnClick
                      pauseOnHover
                      theme="colored"
                    />
                    <Web3Banner
                      currentNetwork={network.id}
                      requiredNetwork={config.network.requiredId}
                      isCorrectNetwork={network.isCorrect}
                      walletBrowserRequired={walletBrowserRequired}
                      lastNotificationTs={lastNotificationTs}
                    />
                  </div>
                </Router>
              </>
            )}
          </Web3App.Consumer>
        </Web3App>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = {
  fetchAvalesOnChain,
  fetchAvalesOffChain,
  fetchUsers,
  fetchExchangeRates,
  fetchFondoGarantia
}

Application.contextType = Web3AppContext;

export default connect(mapStateToProps, mapDispatchToProps)(Application)