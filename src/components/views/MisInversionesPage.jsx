import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Page from './Page'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

/**
 * Pantalla de Inversiones del usuario.
 * 
 */
class MisInversionesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const { t } = this.props;

    return (
      <Page>
        <Grid container spacing={1} style={{ padding: "2em" }}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              {t('misInversionesTitle')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              {t('misInversionesDescription')}
            </Typography>
          </Grid>
        </Grid>
      </Page>
    );
  }
}

MisInversionesPage.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {

  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(MisInversionesPage)))
);