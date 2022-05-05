import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/homeCarouselItemStyle.js";
import classNames from "classnames";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Button from "components/CustomButtons/Button.js";

/**
 * The HomeCarousel section
 */
class HomeCarouselItem extends Component {

  render() {
    const { classes, bkg, title, description, btnLabel, btnOnClick, btnDisabled } = this.props;

    return (
      <Grid container
        spacing={0}
        direction="row"
        justifyContent="center"
        alignItems="center"
        className={classes.homeCarouselItem} style={{ backgroundImage: `url(${bkg})` }}>
        <Grid item xs={12} sm={12}>
          <div className={classes.title}>{title}</div>
          <div className={classes.description}>{description}</div>
          <Button style={{ margin: "0px" }}
            color="primary" round
            className="btn btn-info"
            onClick={btnOnClick}
            disabled={btnDisabled}>
            {btnLabel}
          </Button>
        </Grid>
      </Grid>
    )
  }
}

HomeCarouselItem.propTypes = {};

HomeCarouselItem.defaultProps = {
  btnDisabled: false
};

export default withTranslation()((withStyles(styles)(HomeCarouselItem)))
