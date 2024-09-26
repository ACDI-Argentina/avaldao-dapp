import React, { Component } from 'react';
import styles from "assets/jss/material-kit-react/views/landingPageSections/homeCarouselStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import HomeCarouselItem from './HomeCarouselItem';
import Slider from "react-slick";
import { history } from '@acdi/efem-dapp';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App';

import image1 from "assets/img/carousel/slideBg1.jpg";
import image2 from "assets/img/carousel/slideBg2.jpg";
import image3 from "assets/img/carousel/slideBg3.jpg";

/**
 * The HomeCarousel section
 */
class HomeCarousel extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.start = this.start.bind(this);
  }

  async start() {
    const isUserConnected = this.props.currentUser?.address || false;
    if (isUserConnected == false) {
      await this.context.loginAccount();
    }
    history.push(`/mis-avales`);
  }

  render() {
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true
    };

    const { t } = this.props;

    return (
      <Slider {...settings}>
        <div>
          <HomeCarouselItem
            bkg={image1}
            title={t('homeCarousel1Title')}
            description={t('homeCarousel1Description')}
            btnLabel={t('homeCarousel1BtnLabel')}
            btnOnClick={this.start}
            btnDisabled={false}>
          </HomeCarouselItem>
        </div>
        <div>
          <HomeCarouselItem
            bkg={image2}
            title={t('homeCarousel2Title')}
            description={t('homeCarousel2Description')}
            btnLabel={t('homeCarousel2BtnLabel')}
            btnOnClick={() => {
              history.push(`/about`);
            }}
            btnDisabled={false}>
          </HomeCarouselItem>
        </div>
        <div>
          <HomeCarouselItem
            bkg={image3}
            title={t('homeCarousel3Title')}
            description={t('homeCarousel3Description')}
            btnLabel={t('homeCarousel3BtnLabel')}
            btnOnClick={() => {
              history.push({
                pathname: ``,
                hash: `#soy_inversor`
              });
            }}>
          </HomeCarouselItem>
        </div>
      </Slider>
    )
  }
}

HomeCarousel.contextType = Web3AppContext;

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
