import React, { Component } from 'react';
import styles from "assets/jss/material-kit-react/views/landingPageSections/homeCarouselStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import HomeCarouselItem from './HomeCarouselItem';
import Slider from "react-slick";
import { history } from '../../lib/helpers';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { connect } from 'react-redux'

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

    const { currentUser, t } = this.props;

    const isUserRegistered = currentUser?.registered || false;

    return (
      <Slider {...settings}>
        <div>
          <HomeCarouselItem
            bkg={require("assets/img/carousel/slideBg1.jpg")}
            title={t('homeCarousel1Title')}
            description={t('homeCarousel1Description')}
            btnLabel={t('homeCarousel1BtnLabel')}
            btnOnClick={() => {
              history.push(`/mis-avales`);
            }}
            btnDisabled={!isUserRegistered}>
          </HomeCarouselItem>
        </div>
        <div>
          <HomeCarouselItem
            bkg={require("assets/img/carousel/slideBg2.jpg")}
            title={t('homeCarousel2Title')}
            description={t('homeCarousel2Description')}
            btnLabel={t('homeCarousel2BtnLabel')}
            btnOnClick={() => {
              /* TODO: Implementar */
            }}
            btnDisabled={!isUserRegistered}>
          </HomeCarouselItem>
        </div>
        <div>
          <HomeCarouselItem
            bkg={require("assets/img/carousel/slideBg3.jpg")}
            title={t('homeCarousel3Title')}
            description={t('homeCarousel3Description')}
            btnLabel={t('homeCarousel3BtnLabel')}
            btnOnClick={() => {
              history.push(`/about`);
            }}>
          </HomeCarouselItem>
        </div>
      </Slider>
    )
  }
}

HomeCarousel.propTypes = {};

const mapStateToProps = (state, props) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(HomeCarousel)
  )
);
