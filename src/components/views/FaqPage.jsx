import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Page from './Page'
import { Grid, Typography } from '@material-ui/core'
import styles from "assets/jss/material-kit-react/views/componentsSections/aboutViewStyle.js";

/**
 * Pantalla de FAQ.
 * 
 */
class FaqPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { classes, t, ...rest } = this.props;

    return (
      <Page>
        <Grid container spacing={1} style={{ padding: "2em" }}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              {t('faqTitle')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">{t('faqQuestion1')}</Typography>
            <Typography variant="body1">{t('faqResponse1')}</Typography>
          </Grid>
        </Grid>
      </Page>
    );
  }
}

FaqPage.contextType = Web3AppContext;

export default (withStyles(styles)(withTranslation()(FaqPage)));