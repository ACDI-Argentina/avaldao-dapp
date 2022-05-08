import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Page from './Page'
import { Grid, Typography } from '@material-ui/core'
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
            <Grid className={classes.leftBar} item xs={4}>
              <div className={classes.leftTitle}>AvalDAO es la primera Sociedad de Garantía Recíproca (SGR) descentralizada</div>
            </Grid>
            <Grid item xs={8}>
              <div className={classes.paragraphText}>Una solución WEB3 que otorga garantías a individuos y microempresas no bancarizada, sin historial crediticio o con garantía insuficiente (undercollateralized lending) para que puedan acceder a créditos convenientes, en particular, créditos comerciales.
              Nuestra DAO permite desbloquear el crédito hacia personas excluidas del sistema financiero, otorgando garantías en función de la reputación, y no por estereotipos que hoy están discriminando el acceso al crédito (género, edad, rasgos étnicos, etc).</div>
            </Grid>
            <Grid className={classes.leftBar} item xs={4}>
              <div className={classes.leftTitle}>Por qué construimos sobre blockchain</div>
            </Grid>
            <Grid item xs={8}>
              <div className={classes.paragraphText}><b>Porque</b> permite a las personas y empresas ir creando sobre una identidad digital auto-soberana una reputación generada a partir de credenciales inmutables otorgadas por terceras partes
              <br/><b>Porque</b> nos permite a través de smart contract generar contratos autónomos que bloquean fondos y ejecuta las garantías sin intermediarios.
              <br/><b>Porque</b> nos pemite programar y transparentar la economía de avalDAO y los niveles de riegos que se asumen.
              <br/><b>Porque</b> creemos que el futuro de las finanzas son las organizaciones autónomas descentralizadas (DAO). Una nueva generación de empresas propiedad de la comunidad a la cual le aporta valor, de acceso abierto y global.</div>
            </Grid>
            <Grid className={classes.leftTitle} item xs={12}>
              Background
            </Grid>
            <Grid className={classes.paragraphText} item xs={12}>
              AVALDAO es una iniciativa de ACDI, una organización argentina de la sociedad civil que promueve el desarrollo social integral teniendo como centro a la persona y como método la innovación y el partnership.<br/>ACDI en alianza con el BID Lab viene acompañando un proceso de desarrollo de las comunidades más vulnerables de la región del Gran Chaco llamado “The Furute is in the Forest”, introduciendo innovaciones tecnológicas y generando a estas poblaciones oportunidades sostenibles para la superación de su situación de pobreza al mismo tiempo que se conservan los recursos naturales de esta gran región de importancia global para la lucha contra el cambio climático.
              ACDI, a partir de la alianza con RSK-IOV Lab, ha comenzado en el 2020 el desarrollo una serie de soluciones financieras basadas en la infraestructura RSK con la finalidad de conectar la “economía real” con la “economía on-chain” en favor de las comunidades que están fuera del sistema financiero tradicional, sin acceso al crédito ni a soluciones de ahorro e inversión.
            </Grid>
            <Grid className={classes.leftTitle} item xs={12}>
              Alianzas
            </Grid>
            <Sponsors/>
          </Grid>
          <Grid item xs={0} md={2}></Grid>
        </Grid>
        <Grid item xs={12}>
          <DetailedPlatformOperation/>
        </Grid>
      </Page>
    );
  }
}

AboutPage.contextType = Web3AppContext;

export default (withStyles(styles)(
  withTranslation()(AboutPage)));