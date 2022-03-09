import React, { Component } from 'react';
import styles from "assets/jss/material-kit-react/views/landingPageSections/platformOperationStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from '@material-ui/core/CardContent'
import { Grid } from '@material-ui/core';
import Button from "components/CustomButtons/Button.js";
import classNames from "classnames";
import { history } from '../../lib/helpers'


/**
 * The PlatformOperation section
 */
class PlatformOperation extends Component {

  goSolicitarAval() {
    history.push(`/aval/solicitud`);
  }

  render() {
    const { currentUser, classes, t, } = this.props;

    const allowSolicitar = currentUser.isSolicitante();

    return (
      <div className={classes.section}>
        <div className={classes.sectionGlass}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <h2 className={classes.title}>
                {t('platformOperationTitle')}
              </h2>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.operationDescription}>
                <img className={classes.operationDescriptionImg} src={require("assets/img/diagramaFuncionamiento.jpg")}></img>
              </div>
            </Grid>
            <Grid item xs={6}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.cardMedia}
                  image={require("assets/img/inversorCardAvatar.jpg")}>
                </CardMedia>
                <CardContent className={classNames(classes.cardContent, classes.disabledCard)}>
                  <Grid container spacing={1} align="left">
                    <Grid item xs={12} className={classes.cardTitle}>
                      {t('investorCardTitle')}
                    </Grid>
                    <Grid item xs={12} className={classes.cardDescription}>
                      {t('investorCardDescription')}
                    </Grid>
                    <Grid item xs={12} className={classes.cardQuestion}>
                      {t('investorCardQuestion')}
                    </Grid>
                    <Grid item xs={12}>
                      <Button style={{margin: "1.5em 0"}} color="primary" disabled round
                        className="btn btn-info">
                        {t('investorCardBtnLabel')}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.cardMedia}
                  image={require("assets/img/solicitanteCardAvatar.jpg")}>
                </CardMedia>
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={1} align="left">
                    <Grid item xs={12} className={classes.cardTitle}>
                      {t('applicantCardTitle')}
                    </Grid>
                    <Grid item xs={12} className={classes.cardDescription}>
                      {t('applicantCardDescription')}
                    </Grid>
                    <Grid item xs={12} className={classes.cardQuestion}>
                      {t('applicantCardQuestion')}
                    </Grid>
                    <Grid item xs={12}>
                      <Button style={{margin: "1.5em 0"}} color="primary" round
                        className="btn btn-info"
                        disabled={!allowSolicitar}
                        onClick={this.goSolicitarAval}>
                        {t('applicantCardBtnLabel')}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

PlatformOperation.propTypes = {};

export default withTranslation()((withStyles(styles)(PlatformOperation)))
