import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import PlatformFeatures from "components/views/PlatformFeatures.jsx";
import BlockchainBenefits from "components/views/BlockchainBenefits.jsx";
import JoinGivethCommunity from 'components/JoinGivethCommunity.jsx';
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { withTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

export default withTranslation()(function LandingPage(props) {
  const classes = useStyles();
  const { t, ...rest } = props;

  return (
    <div className={classes.landingPage}>
      <Header
        color="white"
        brand={<img src={require("assets/img/logos/avaldao.png")}
          alt={t('give4forest')}
          className={classes.dappLogo} />}
        {...rest}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <img src={require("assets/img/icons/separator.png")} alt="" className={classes.topSeparator} />
          <JoinGivethCommunity history={props.history} />
          <PlatformFeatures />
          <BlockchainBenefits />
          <img src={require("assets/img/icons/separator.png")} alt="" className={classes.bottomSeparator} />
          <Footer />
        </div>
      </div>
    </div>
  );
});
