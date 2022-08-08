import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card'
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions';
import { history } from '@acdi/efem-dapp';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { connect } from 'react-redux'
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
 * Card de Solicitante.
 */
class InversorCard extends Component {

  goMisAvales() {
    history.push(`/mis-avales`);
  }

  render() {
    const { currentUser, classes, t, } = this.props;
    const isUserRegistered = currentUser?.registered || false;
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={require("assets/img/solicitante.png")}>
        </CardMedia>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} align="left">
            <Grid item xs={12}>
              <Typography variant="h6">
                {t('solicitanteCardTitle')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <Trans i18nKey="solicitanteCardDescription">
                </Trans>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <SecondaryButton style={{ margin: "1.5em 0" }}
            disabled={!isUserRegistered}
            onClick={this.goMisAvales}>
            {t('solicitanteCardBtnLabel')}
          </SecondaryButton>
        </CardActions>
      </Card>
    )
  }
}

InversorCard.propTypes = {};

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(InversorCard)))
);
