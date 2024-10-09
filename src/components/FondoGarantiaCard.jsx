import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { selectAvalesVigentes } from 'redux/reducers/avalesSlice';
import { selectAvalesFinalizados } from 'redux/reducers/avalesSlice';
import { connect } from 'react-redux'
import FondoGarantiaChartPie from './FondoGarantiaChartPie';

class FondoGarantiaCard extends Component {

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent>
          <FondoGarantiaChartPie />
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

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)
 (FondoGarantiaCard)));