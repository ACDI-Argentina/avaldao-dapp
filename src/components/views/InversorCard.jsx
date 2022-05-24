import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card'
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions';
import { history } from '../../lib/helpers'
import SecondaryButton from 'components/buttons/SecondaryButton';

const styles = {
  card: {
    
  },
  cardMedia: {
    height: "12em",
    "@media (max-width: 1200px)": {
      height: "10em",
    }
  },
  cardContent: {
    padding: "2em",
    height: "10em"
  },
  cardActions: {
    paddingLeft: "2em"
  }
};

/**
 * Card de Inversor.
 */
class InversorCard extends Component {

  goMisInversiones() {
    history.push(`/mis-inversiones`);
  }

  render() {
    const { classes, t, } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={require("assets/img/inversor.png")}>
        </CardMedia>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} align="left">
            <Grid item xs={12}>
              <Typography variant="h6">
                {t('inversorCardTitle')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                {t('inversorCardDescription')}
              </Typography>
            </Grid>

          </Grid>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <SecondaryButton
            style={{ margin: "1.5em 0" }}
            onClick={this.goMisInversiones}>
            {t('inversorCardBtnLabel')}
          </SecondaryButton>
        </CardActions>
      </Card>
    )
  }
}

InversorCard.propTypes = {};

export default withTranslation()((withStyles(styles)(InversorCard)))
