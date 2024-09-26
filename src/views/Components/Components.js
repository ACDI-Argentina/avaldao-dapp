import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
// sections for this page
import HeaderLinks from "components/Header/HeaderLinks.js";
import SectionNavbars from "./Sections/SectionNavbars.js";
import SectionTabs from "./Sections/SectionTabs.js";
import SectionPills from "./Sections/SectionPills.js";
import SectionNotifications from "./Sections/SectionNotifications.js";
import SectionTypography from "./Sections/SectionTypography.js";
/* import SectionCarousel from "./Sections/SectionCarousel.js"; */
import SectionCompletedExamples from "./Sections/SectionCompletedExamples.js";
import SectionExamples from "./Sections/SectionExamples.js";

import styles from "assets/jss/material-kit-react/views/components.js";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

export default function Components(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { ...rest } = props;
  return (
    <div>
      <Header
        brand={<img src={require("assets/img/logos/avaldao.svg")}
        alt={t('give4forest')}
        className={classes.dappLogo}/>}
        rightLinks={<HeaderLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <SectionNavbars />
        <SectionTabs />
        <SectionPills />
        <SectionNotifications />
        <SectionTypography />
     {/*    <SectionCarousel /> */}
        <SectionCompletedExamples />
        <SectionExamples />
      </div>
      <Footer />
    </div>
  );
}
