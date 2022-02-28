import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/homeCarouselStyle.js";
import classNames from "classnames";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import HomeCarouselItem from './HomeCarouselItem';
import Slider from "react-slick";

/**
 * The HomeCarousel section
 */
class HomeCarousel extends Component {

  render() {
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
  
    const { t } = this.props;

    return (
      <Slider {...settings}>
        <div>
          <HomeCarouselItem
            bkg={require("assets/img/carousel/slideBg1.png")}
            title={t('homeCarousel1Title')}
            description={t('homeCarousel1Description')}
            btnLabel={t('homeCarousel1BtnLabel')}
            onClick={() => {}}>
          </HomeCarouselItem>
        </div>
        <div>
          <HomeCarouselItem
            bkg={require("assets/img/carousel/slideBg2.png")}
            title={t('homeCarousel2Title')}
            description={t('homeCarousel2Description')}
            btnLabel={t('homeCarousel2BtnLabel')}
            onClick={() => {}}>
          </HomeCarouselItem>
        </div>
        <div>
          <HomeCarouselItem
            bkg={require("assets/img/carousel/slideBg3.png")}
            title={t('homeCarousel3Title')}
            description={t('homeCarousel3Description')}
            btnLabel={t('homeCarousel3BtnLabel')}
            onClick={() => {}}>
          </HomeCarouselItem>
        </div>
      </Slider>
    )
  }
}

HomeCarousel.propTypes = {};

export default withTranslation()((withStyles(styles)(HomeCarousel)))
