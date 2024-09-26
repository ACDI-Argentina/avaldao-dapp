import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import HowDoesItWorkDiagram from './HowDoesItWorkDiagram';

const styles = {
  root: {
    color: "#FFFFFF"
  }
};

/**
 * Sección "Cómo funciona" de manera reducida.
 */
class HowDoesItWorkResume extends Component {

  render() {
    const { classes, t, } = this.props;
    return (
      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className={classes.root}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                {t('howDoesItWorkTitle')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <HowDoesItWorkDiagram></HowDoesItWorkDiagram>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

HowDoesItWorkResume.propTypes = {};

export default withTranslation()((withStyles(styles)(HowDoesItWorkResume)))
