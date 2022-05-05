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

  goMisInversiones() {
    history.push(`/mis-inversiones`);
  }

  goMisAvales() {
    history.push(`/mis-avales`);
  }

  render() {
    const { currentUser, classes, t, } = this.props;

    const isUserRegistered = currentUser?.registered || false;

    return (
      <div className={classes.section}>
        <div className={classes.sectionGlass}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <h2 className={classes.title}>
                {t('platformOperationTitle')}
              </h2>
            </Grid>
            <Grid id="funcionamiento" item xs={12}>
              <div className={classes.operationDescription}>
                <img className={classes.operationDescriptionImg} src={require("assets/img/diagramaFuncionamiento.jpg")}></img>
              </div>
            </Grid>
            <Grid id="soy_inversor" item xs={6}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.cardMedia}
                  image={require("assets/img/inversorCardAvatar.jpg")}>
                </CardMedia>
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={1} align="left">
                    <Grid item xs={12} className={classes.cardTitle}>
                      {t('inversorCardTitle')}
                    </Grid>
                    <Grid item xs={12} className={classes.cardDescription}>
                      {t('inversorCardDescription')}
                    </Grid>
                    <Grid item xs={12}>
                      <Button style={{ margin: "1.5em 0" }}
                        color="primary"
                        round
                        className="btn btn-info"
                        onClick={this.goMisInversiones}>
                        {t('inversorCardBtnLabel')}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid id="soy_solicitante" item xs={6}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.cardMedia}
                  image={require("assets/img/solicitanteCardAvatar.jpg")}>
                </CardMedia>
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={1} align="left">
                    <Grid item xs={12} className={classes.cardTitle}>
                      {t('solicitanteCardTitle')}
                    </Grid>
                    <Grid item xs={12} className={classes.cardDescription}>
                      {t('solicitanteCardDescription1')}
                    </Grid>
                    <Grid item xs={12} className={classes.cardDescription}>
                      {t('solicitanteCardDescription2')}
                    </Grid>
                    <Grid item xs={12}>
                      <Button style={{ margin: "1.5em 0" }} color="primary" round
                        className="btn btn-info"
                        disabled={!isUserRegistered}
                        onClick={this.goMisAvales}>
                        {t('solicitanteCardBtnLabel')}
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
