import React, { Component } from 'react';
import styles from "assets/jss/material-kit-react/views/componentsSections/detailedPlatformOperationStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';


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
                  <b>Donantes e inversores</b> de impacto aportan capital criptográfico al Fondo de Garantía en busca de retorno social con sustentabilidad económica. El capital se mantiene rentabilizado a través de diferentes instrumentos de inversión en las finanzas descentralizadas, tarifas generadas por la utilización de la plataforma y programas de incentivos.<br /><br />Solicitantes de Aval (quien compra) van construyendo su reputación sobre su identidad digital a través de credenciales otorgadas por emisores que acreditan aspectos de responsabilidad, conocimientos, productivos, entre otros.
                </div>
              </Grid>
              <Grid item xs={6} md={6}>
                <div className={classes.paragraphText}>
                  <b>Comercios</b> (quien vende) ofrecen mejores condiciones de crédito para la adquisición de sus bienes y servicios a quienes cuenten con garantías aprobadas por avalDAO.<br /><br />avalDAO ofrece su plataforma para que “quien vende” y “quien compra” firmen un contrato de aval con sus claves privadas desde sus wallet. Los smart contract de avalDAO automatizan la operación de aval, bloqueando fondos a favor del comercio y desbloqueando fondos si se cumplen o no los compromisos programados.
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
      </Grid>
    )
  }
}

DetailedPlatformOperation.propTypes = {};

export default withTranslation()((withStyles(styles)(DetailedPlatformOperation)))
