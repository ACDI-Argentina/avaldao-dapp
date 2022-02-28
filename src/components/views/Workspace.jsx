import React, { Component } from 'react'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import FondoGarantia from './FondoGarantia'
import AvalTable from './AvalTable'
import Divider from '@material-ui/core/Divider'
import Page from './Page'
import Button from "components/CustomButtons/Button.js"
import { withStyles } from '@material-ui/core/styles'
import { history } from '../../lib/helpers'
import AvalTaskList from './AvalTaskList'

/**
 * Pantalla de espacio de trabajo.
 * 
 */
class Workspace extends Component {

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

    const { currentUser, t } = this.props;

    const allowSolicitar = currentUser.isSolicitante();

    let showAvalTaskList = false;
    let avalTableWidthMd = 12;
    if (currentUser.authenticated) {
      showAvalTaskList = true;
      avalTableWidthMd = 9;
    }

    return (
      <Page>
        <Grid container spacing={3} style={{ padding: "2em" }}>
          <Grid item xs={12}>
            <FondoGarantia></FondoGarantia>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} style={{ padding: "0px" }}>
            <Grid container justifyContent="flex-end">
              <Button color="primary"
                round
                className="btn btn-info"
                disabled={!allowSolicitar}
                onClick={this.goSolicitarAval}>
                {t("avalSolicitarBtn")}
              </Button>
            </Grid>
          </Grid>
          {showAvalTaskList && (
            <Grid item sm={12} md={3}>
              <AvalTaskList user={currentUser} />
            </Grid>
          )}
          <Grid item sm={12} md={avalTableWidthMd}>
            <AvalTable />
          </Grid>
        </Grid>
      </Page>
    );
  }
}

Workspace.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(Workspace)))
);