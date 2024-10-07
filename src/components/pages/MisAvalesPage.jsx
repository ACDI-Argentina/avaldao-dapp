import React, { Component } from 'react';

import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Dashboard from 'components/views/Dashboard'
import AvalTable from 'components/views/AvalTable'
import Page from './Page'
import { withStyles } from '@material-ui/core/styles'
import AvalTaskList from 'components/views/AvalTaskList'
import { selectUserAvales } from '../../redux/reducers/avalesSlice'
import { Typography } from '@material-ui/core'
import Background from 'components/views/Background'
import Paper from '@material-ui/core/Paper';

import config from 'configuration';
import CreateAvalButton from 'components/aval/CreateAvalButton'

/**
 * Pantalla de Avales del usuario.
 * 
 */
class MisAvalesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      isBlocking: false
    };
  }


  render() {

    const { avales, currentUser, t } = this.props;

    let showAvalTaskList = false;
    let avalTableWidthMd = 12;

    const allowSolicitar = currentUser.hasRole(config.SOLICITANTE_ROLE);

    if (currentUser && currentUser.authenticated) {
      showAvalTaskList = true;
      avalTableWidthMd = 9;
    }

    return (
      <Page>
        <Background>
          <Paper>
            <Grid container spacing={1} style={{ padding: "2em" }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5">
                  {t('misAvalesTitle')}
                </Typography>
              </Grid>
              <Grid item xs={12}>

                <Grid container spacing={3} style={{ marginTop: "1em", marginBottom: "1em" }}>

                  <Grid item sm={12} md={avalTableWidthMd}>
                  {allowSolicitar && <Grid item sm={12} > <CreateAvalButton /> </Grid>}
                    <AvalTable avales={avales} />
                  </Grid>
                  {showAvalTaskList && (
                    <Grid item sm={12} md={3}>
                      <AvalTaskList user={currentUser} />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Background>
        <Dashboard></Dashboard>
      </Page>
    );
  }
}

MisAvalesPage.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  const currentUser = selectCurrentUser(state);
  return {
    currentUser: currentUser,
    avales: selectUserAvales(state, currentUser)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(MisAvalesPage)))
);