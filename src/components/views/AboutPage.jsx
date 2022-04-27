import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Page from './Page'
import { Grid, Typography } from '@material-ui/core'

/**
 * Pantalla de Usuarios.
 * 
 */
class AboutPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { classes, t, ...rest } = this.props;

    return (
      <Page>
        <Grid container spacing={3} style={{ padding: "2em" }}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              {t('aboutAvalDAOTitle')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {/* Contenido */}
          </Grid>
        </Grid>
      </Page>
    );
  }
}

AboutPage.contextType = Web3AppContext;

const styles = theme => ({

});


export default (withStyles(styles)(
  withTranslation()(AboutPage)));