import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/platformFeaturesStyle.js";
import classNames from "classnames";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Button from "components/CustomButtons/Button.js";

/**
 * The PlatformFeatures section
 */
class PlatformFeatures extends Component {

  render() {
    const { classes, t, } = this.props;

    return (
      <div className={classes.section}>
        <h2 className={classes.title}>
          {t('platformFeaturesTitle1')}
        </h2>
        <h6 className={classes.description}>
          {t('platformFeaturesDescription1')}
        </h6>
        <Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={10}
            style={{ marginTop: '3em', marginBottom: '3em' }}
          >
            <Button color="primary" round
              className="btn btn-info">
              Conocer más
            </Button>
          </Grid>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={10}
          >
            <Grid item xs={12} sm={4} md={4} lg={3} xl={3} className={classes.featureSection}>
              <div className={classes.sectionTitle}>{t('transparency')}</div>
              <h6 className={classes.sectionDescription}>
                {t('transparencyDescription')}
              </h6>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3} xl={3} className={classes.featureSection}>
              <div className={classes.sectionTitle}>{t('autonomy')}</div>
              <h6 className={classes.sectionDescription}>
                {t('autonomyDescription')}
              </h6>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3} xl={3} className={classes.featureSection}>
              <div className={classes.sectionTitle}>{t('security')}</div>
              <h6 className={classes.sectionDescription}>
                {t('securityDescription')}
              </h6>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

PlatformFeatures.propTypes = {};

export default withTranslation()((withStyles(styles)(PlatformFeatures)))
