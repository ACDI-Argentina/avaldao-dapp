import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { selectAvalesVigentes } from 'redux/reducers/avalesSlice';
import { selectAvalesFinalizados } from 'redux/reducers/avalesSlice';
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography';

class StatisticsCard extends Component {

  render() {
    const { avalesVigentes, avalesFinalizados, classes, t } = this.props;
    
    return (
      <Card className={classes.root}>
        <CardContent>
          <Grid container
            spacing={1}
            justifyContent="flex-start"
            alignItems="flex-start">
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                {t('statisticsAvalesVigentes')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                {avalesVigentes.length}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                {t('statisticsAvalesFinalizados')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                {avalesFinalizados.length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

const styles = theme => ({
  root: {
    border: '1px solid #DDD',
    borderRadius: '10px',
    padding: ".5em",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(5px)",
    boxShadow: "0px 4px 25px 2px rgba(0, 0, 0, 0.15), inset -5px -5px 0px -10px rgba(255, 255, 255, 0.1), inset 5px 5px 10px rgba(255, 255, 255, 0.1)",
    color: "#FFF"
  },
  inline: {
    display: 'inline',
    fontWeight: "bold"
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    avalesVigentes: selectAvalesVigentes(state),
    avalesFinalizados: selectAvalesFinalizados(state)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(StatisticsCard)))
);