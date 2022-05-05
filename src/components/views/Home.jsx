import React, { Component } from 'react'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Page from './Page'
import { withStyles } from '@material-ui/core/styles'
import { history } from '../../lib/helpers'
import PlatformFeatures from './PlatformFeatures'
import PlatformOperation from './PlatformOperation'
import HomeCarousel from './HomeCarousel'
import FondoGarantia from './FondoGarantia'
import Sponsors from './Sponsors'

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

  goSolicitarAval() {
    history.push(`/aval/solicitud`);
  }

  render() {

    return (
      <Page>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <HomeCarousel />
          </Grid>
          <Grid item xs={12}>
            <PlatformFeatures />
          </Grid>
          <Grid item xs={12}>
            <PlatformOperation {...this.props} />
          </Grid>
          <Grid item xs={12}>
            <FondoGarantia />
          </Grid>
          <Grid item xs={12}>
            <Sponsors />
          </Grid>
        </Grid>
      </Page>
    );
  }
}

Home.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(Home)))
);