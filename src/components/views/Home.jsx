import React, { Component } from 'react';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import FondoGarantia from './FondoGarantia';
import AvalList from './AvalList';
import Divider from '@material-ui/core/Divider'
import Page from './Page';

import Button from "components/CustomButtons/Button.js";
import { Link } from 'react-router-dom';

/**
 * Pantalla Home.
 * 
 */
class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      isBlocking: false
    };
  }

  async requestConnection(translate) {

    const labels = {
      title: translate("requestConnectionTitle"),
      text: translate("requestConnectionText"),
      cancel: translate("requestConnectionCancel"),
      ok: translate("requestConnectionOk"),
    }

    const confirm = await React.swal({
      icon: 'info',
      title: labels.title,
      text: labels.text,

      buttons: [labels.cancel, labels.ok],
      closeOnClickOutside: false,
    });

    return confirm;
  }

  async componentDidMount() {
    const { history, currentUser, t } = this.props;
    const { loginAccount } = this.context;
    const { authenticateIfPossible } = this.context.modals.methods;

    const goHome = () => history.push('/');

    if (!currentUser || !currentUser.address) {
      const confirmation = await this.requestConnection(t);
      if (confirmation) {
        const connected = await loginAccount();
        if (!connected) {
          return goHome();
        }
      } else {
        return goHome();
      }
    }

    authenticateIfPossible(this.props.currentUser)
      .then(() => this.setState({ isLoading: false }))
      .catch(err => {
        if (err === 'noBalance') {
          history.goBack();
        } else {
          this.setState({ isLoading: false });
        }
      }); 
  }

  render() {

    const { classes, t, ...rest } = this.props;

    return (
      <Page>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FondoGarantia></FondoGarantia>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} style={{ padding: "0px" }}>
            <Grid container justifyContent="flex-end">
              <Link to="/solicitar-aval">
                <Button color="primary" className="btn btn-info">
                  {t("avalSolicitarBtn")}
                </Button>
              </Link>
            </Grid>

          </Grid>
          <Grid item xs={12}>
            <Avales></Avales>
          </Grid>
        </Grid>
      </Page>
    );
  }
}

Home.contextType = Web3AppContext;


const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Home));