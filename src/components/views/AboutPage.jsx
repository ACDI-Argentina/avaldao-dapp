import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation, Trans } from 'react-i18next'
import Page from './Page'
import { Grid, Link, Typography } from '@material-ui/core'
import styles from "assets/jss/material-kit-react/views/componentsSections/aboutViewStyle.js";
import classNames from "classnames";
import Sponsors from './Sponsors'
import DetailedPlatformOperation from './DetailedPlatformOperation'

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
        <Grid container xs={12}>
          <Grid item xs={0} md={2}></Grid>
          <Grid xs={12} md={8}
            container
            direction="row"
            justifyContent="left"
            alignItems="top"
            spacing={2} style={{ padding: "2em" }}>
            <Grid className={classes.titleLeftBar} item xs={12}>
              <h3 className={classes.pageTitle}>{t('aboutAvalDAOTitle')}</h3>
            </Grid>
            <Grid className={classes.leftBar} item xs={4}>
              <div className={classes.leftTitle}>{t('aboutAvalDAOSGRTitle')}</div>
            </Grid>
            <Grid item xs={8}>
              <div className={classes.paragraphText}>
                <span>{t('aboutAvalDAOSGRText1')}</span><br /><span>{t('aboutAvalDAOSGRText2')}</span>
              </div>
            </Grid>
            <Grid className={classes.leftBar} item xs={4}>
              <div className={classes.leftTitle}>{t('aboutAvalDAOWhyBlockchainTitle')}</div>
            </Grid>
            <Grid item xs={8}>
              <div className={classes.paragraphText}>
              <span style={{fontWeight: "bold"}}>{t('aboutAvalDAOWhyBlockchainText1')}</span><span>{t('aboutAvalDAOWhyBlockchainText2')}</span><br />
                <span style={{fontWeight: "bold"}}>{t('aboutAvalDAOWhyBlockchainText3')}</span><span>{t('aboutAvalDAOWhyBlockchainText4')}</span><br />
                <span style={{fontWeight: "bold"}}>{t('aboutAvalDAOWhyBlockchainText5')}</span><span>{t('aboutAvalDAOWhyBlockchainText6')}</span><br />
                <span style={{fontWeight: "bold"}}>{t('aboutAvalDAOWhyBlockchainText7')}</span><span>{t('aboutAvalDAOWhyBlockchainText8')}</span>
              </div>
            </Grid>
            <Grid className={classes.leftTitle} item xs={12}>
              {t('aboutAvalDAOBackgroundTitle')}
            </Grid>
            <Grid className={classes.paragraphText} item xs={12}>
              <span>{t('aboutAvalDAOBackgroundText1')}</span><br />
              <span>{t('aboutAvalDAOBackgroundText2')}</span>
            </Grid>
            <Grid className={classes.leftTitle} item xs={12}>
              {t('aboutAvalDAOTitleAlliances')}
            </Grid>
            <Sponsors />
          </Grid>
          <Grid item xs={0} md={2}></Grid>
        </Grid>
        <Grid item xs={12}>
          <DetailedPlatformOperation />
        </Grid>

        <Grid container xs={12}>
          <Grid item xs={0} md={2}></Grid>
          <Grid xs={12} md={8}
            container
            direction="row"
            justifyContent="left"
            alignItems="top"
            spacing={2} style={{ padding: "2em" }}>
            <Grid className={classes.leftTitle} item xs={12}>
              {t('aboutAvalDAORoadmap')}
            </Grid>
            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              xs={12} spacing={5} style={{ padding: "2em" }}>
              <Grid className={classes.roadMapCard} item xs={5}>
                <div className={classes.roadMapTitle}>{t('aboutAvalDAORoadMap1Title')}</div>
                <div className={classes.roadMapText}>{t('aboutAvalDAORoadMap1Text')}</div>
              </Grid>
              <Grid className={classes.roadMapCard} item xs={5}>
                <div className={classes.roadMapTitle}>{t('aboutAvalDAORoadMap2Title')}</div>
                <div className={classes.roadMapText}>{t('aboutAvalDAORoadMap2Text')}</div>
              </Grid>
              <Grid className={classes.roadMapCard} item xs={5}>
                <div className={classes.roadMapTitle}>{t('aboutAvalDAORoadMap3Title')}</div>
                <div className={classNames(classes.roadMapText, classes.roadMapCurrentText)}>{t('aboutAvalDAORoadMap3Text')}</div>
              </Grid>
              <Grid className={classes.roadMapCard} item xs={5}>
                <div className={classes.roadMapTitle}>{t('aboutAvalDAORoadMap4Title')}</div>
                <div className={classes.roadMapText}>{t('aboutAvalDAORoadMap4Text')}</div>
              </Grid>
              <Grid className={classes.roadMapCard} item xs={5}>
                <div className={classes.roadMapTitle}>{t('aboutAvalDAORoadMap5Title')}</div>
                <div className={classes.roadMapText}>{t('aboutAvalDAORoadMap5Text')}</div>
              </Grid>
              <Grid className={classes.roadMapCard} item xs={5}>
                <div className={classes.roadMapTitle}>{t('aboutAvalDAORoadMap6Title')}</div>
              </Grid>
            </Grid>
            <Grid style={{marginTop: "2em"}} className={classes.leftTitle} item xs={12}>
              {t('aboutAvalDAORepositoryTitle')}
            </Grid>
            <Grid item xs={12}>
              <div><b>{t('aboutAvalDAORepositoryText')}</b></div>
              <Link href={t('aboutAvalDAORepositoryLink')} target="_blank" underline="none">
                {t('aboutAvalDAORepositoryLink')}
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Page>
    );
  }
}

AboutPage.contextType = Web3AppContext;

export default (withStyles(styles)(
  withTranslation()(AboutPage)));