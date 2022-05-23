import React, { Component } from 'react';
import styles from "assets/jss/material-kit-react/views/landingPageSections/platformOperationStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import HowDoesItWorkResume from './HowDoesItWorkResume';
import InversorCard from './InversorCard';
import SolicitanteCard from './SolicitanteCard';
import Background from './Background';

/**
 * The PlatformOperation section
 */
class PlatformOperation extends Component {

  render() {
    const { classes, t, } = this.props;
    return (
      <Background>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <HowDoesItWorkResume></HowDoesItWorkResume>
          </Grid>
          <Grid id="soy_inversor" item xs={12} md={6}>
            <InversorCard></InversorCard>
          </Grid>
          <Grid id="soy_solicitante" item xs={12} md={6}>
            <SolicitanteCard></SolicitanteCard>
          </Grid>
        </Grid>
      </Background>
    )
  }
}

PlatformOperation.propTypes = {};

export default withTranslation()((withStyles(styles)(PlatformOperation)))
