import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/footerStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

/**
 * The Footer section
 */
class Footer extends Component {

  render() {
    const { classes, t, } = this.props;

    return (
      <div className={classes.section}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="left"
          spacing={0}
        >
          <Grid item xs={8} sm={6}>
            <img src={require("assets/img/logos/avaldao-alt.svg")} alt={t('give4forest')} className={classes.dappLogo} />
          </Grid>
        </Grid>
        <h6 className={classes.disclaimer}>
            {t('disclaimer')}
        </h6>
      </div>
    )
  }
}

Footer.propTypes = {};

export default withTranslation()((withStyles(styles)(Footer)))
