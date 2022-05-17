import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import HowDoesItWorkDiagram from './HowDoesItWorkDiagram';

const styles = {
  root: {
    padding: "4em",
    backgroundColor: "#7868E5",
    color: "#FFFFFF"
  },
  central: {
    border: '1px solid #FFF',
    borderRadius: '5px',
    padding: "3em",
    background: "linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))",
    backdropFilter: "blur(5px)"
  }
};

/**
 * Sección "Cómo funciona".
 */
class HowDoesItWork extends Component {

  render() {
    const { classes, t, } = this.props;
    return (
      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className={classes.root}>
        <Grid xs={12} md={8} className={classes.central}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <Trans i18nKey="howDoesItWorkDescription"
                  components={{ ol: <ol />, li: <li /> }} />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <HowDoesItWorkDiagram></HowDoesItWorkDiagram>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <Trans i18nKey="howDoesItWorkLearnMore"
                  components={{
                    linkGithub: <Link href={"https://github.com/ACDI-Argentina/avaldao/wiki/Procesos#protocolo"}>Github</Link>
                  }}>
                </Trans>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

HowDoesItWork.propTypes = {};

export default withTranslation()((withStyles(styles)(HowDoesItWork)))
