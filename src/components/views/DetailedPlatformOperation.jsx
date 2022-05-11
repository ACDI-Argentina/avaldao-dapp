import React, { Component } from 'react';
import styles from "assets/jss/material-kit-react/views/componentsSections/detailedPlatformOperationStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Link } from '@material-ui/core';


/**
 * The DetailedPlatformOperation section
 */
class DetailedPlatformOperation extends Component {

  render() {
    const { classes, t, } = this.props;

    return (
      <Grid className={classes.section} container xs={12}>
        <Grid item xs={0} md={2}></Grid>
        <Grid xs={12} md={8} className={classes.sectionGlass}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <div className={classes.title}>
                {t('platformOperationTitle')}
              </div>
            </Grid>
              <Grid item xs={6} md={6}>
                <div className={classes.paragraphText}>
                  <span style={{fontWeight: "bold"}}>{t('detailedOperationInvestorText1')}</span>{t('detailedOperationInvestorText2')}<br /><br />{t('detailedOperationInvestorText3')}
                </div>
              </Grid>
              <Grid item xs={6} md={6}>
                <div className={classes.paragraphText}>
                  <span style={{fontWeight: "bold"}}>{t('detailedOperationCommerceText1')}</span>{t('detailedOperationCommerceText2')}<br /><br />{t('detailedOperationCommerceText3')}
                </div>
              </Grid>
            <Grid id="funcionamiento" item xs={12}>
              <div className={classes.operationDescription}>
                <img className={classes.operationDescriptionImg} src={require("assets/img/diagramaFuncionamiento.jpg")}></img>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={0} md={2}></Grid>
        <Grid item xs={0} md={2}></Grid>
        <Grid xs={12} md={8} className={classes.bottomLink}>
          {t('detailedOperationKnowMoreText')}<Link href={t('detailedOperationKnowMoreLink')} target="_blank" underline="none"
            style={{color: "#FFF"}}>
            {t('detailedOperationKnowMoreLink')}
          </Link>
        </Grid>
        <Grid item xs={0} md={2}></Grid>
      </Grid>
    )
  }
}

DetailedPlatformOperation.propTypes = {};

export default withTranslation()((withStyles(styles)(DetailedPlatformOperation)))
