import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation, Trans } from 'react-i18next'
import Page from './Page'
import { Grid, Link } from '@material-ui/core'
import styles from "assets/jss/material-kit-react/views/componentsSections/aboutViewStyle.js";
import Sponsors from 'components/views/Sponsors'
import Roadmap from 'components/views/Roadmap'
import Typography from '@material-ui/core/Typography';
import HowDoesItWork from 'components/views/HowDoesItWork'

/**
 * Pantalla de acerca de Avaldao.
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

        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="top"
          spacing={3}
          style={{ paddingTop: "2em" }}>

          <Grid item xs={12} md={8}>

            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="top"
              spacing={3}
              style={{ paddingLeft: "2em", paddingRight: "2em" }}>

              <Grid item xs={12}>
                <Typography variant="h6" className={classes.pageTitle}>
                  {t('aboutAvalDAOSubtitle')}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <Trans i18nKey="aboutAvalDAOParagraph1"
                    components={{ ul: <ul />, li: <li /> }} />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <Trans i18nKey="aboutAvalDAOParagraph2"
                    components={{ ul: <ul />, li: <li /> }} />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <Trans i18nKey="aboutAvalDAOParagraph3"
                    components={{ ul: <ul />, li: <li /> }} />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <Trans i18nKey="aboutAvalDAOParagraph4"
                    components={{ ul: <ul />, li: <li /> }} />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <Trans i18nKey="aboutAvalDAOParagraph5"
                    components={{ ul: <ul />, li: <li /> }} />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <Trans i18nKey="aboutAvalDAOParagraph6"
                    components={{ ul: <ul />, li: <li /> }} />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <Trans i18nKey="aboutAvalDAOParagraph7"
                    components={{
                      linkAcdi: <Link href={"http://www.acdi.org.ar"}>ACDI</Link>,
                      linkBidLab: <Link href={"https://bidlab.org/en"}>BID Lab</Link>,
                      linkRskIovLab: <Link href={"https://www.iovlabs.org"}>RSK-IOV Lab</Link>
                    }}>
                  </Trans>
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <Sponsors />
          </Grid>

          <Grid item xs={12}>
            <HowDoesItWork></HowDoesItWork>
          </Grid>

          <Grid item xs={12} md={8}
            style={{ paddingLeft: "2em", paddingRight: "2em" }}>
            <Roadmap></Roadmap>
          </Grid>

          <Grid item xs={12} md={8}
            style={{ paddingLeft: "2em", paddingRight: "2em" }}>
            <Typography variant="body1">
              <Trans i18nKey="aboutAvalDAOParagraph8"
                components={{
                  linkGithub: <Link href={"https://github.com/ACDI-Argentina/avaldao/wiki"}>Github</Link>
                }}>
              </Trans>
            </Typography>
          </Grid>
        </Grid>
      </Page>
    );
  }
}

AboutPage.contextType = Web3AppContext;

export default (withStyles(styles)(withTranslation()(AboutPage)));