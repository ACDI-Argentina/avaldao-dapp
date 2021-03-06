import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/homeCarouselItemStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import PrimaryButton from 'components/buttons/PrimaryButton';

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
          <PrimaryButton
            style={{ margin: "0px" }}
            onClick={btnOnClick}
            disabled={btnDisabled}>
            {btnLabel}
          </PrimaryButton>
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
