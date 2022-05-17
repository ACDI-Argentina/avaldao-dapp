import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {

  },
  img: {
    maxWidth: "100%",
    height: "auto"
  }
};

/**
 * Diagrama de "Cómo funciona".
 */
class HowDoesItWorkDiagram extends Component {

  render() {
    const { classes, i18n } = this.props;
    return (
      <div className={classes.root}>
        <img className={classes.img} src={require(`assets/img/how-does-it-work-${i18n.language}.svg`)}></img>
      </div>
    )
  }
}

HowDoesItWorkDiagram.propTypes = {};

export default withTranslation()((withStyles(styles)(HowDoesItWorkDiagram)))
