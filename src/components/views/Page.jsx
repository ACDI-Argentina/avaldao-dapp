import React from 'react'
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import { makeStyles } from "@material-ui/core";
import AvalStoreInspector from 'inspectors/AvalStoreInspector';
import MainMenu from 'components/MainMenu';

import { useTranslation } from 'react-i18next';
import { maxWidth } from 'styled-system';


const Page = ({ children, ...props }) => {
  const classes = makeStyles(styles)();
  const { t } = useTranslation();

  //TODO: allow overwrite by props
  const brandSource = require("assets/img/logos/give4forest.png");
  const parallaxSource = require("assets/img/profile-default-bg.jpg");

  return (

    <div className={classes.root}>
      <Header
        color="white"
        brand={<img src={brandSource}
          alt={t('give4forest')}
          className={classes.dappLogo} />}
        rightLinks={<MainMenu />}
        fixed
        changeColorOnScroll={{
          height: 0,
          color: "white"
        }}
        {...props}
      />
      <Parallax small image={parallaxSource} />

      <div className={classes.panel}>
        {children}
      </div>
      <Footer />
    </div>
  );

}

export default Page;



const styles = theme => ({
  root: {
    overflowX: "hidden"
  },
  panel: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3",
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    padding: '2em',
    flexGrow: 1,
    minHeight: "75vh",
    /* maxWidth:"1300px",
    margin: "-60px auto 0px", */
    
  },

  dappLogo: {
    maxHeight: "4em",
    "@media (max-width: 800px)": {
      maxHeight: "3em"
    },
    "@media (max-width: 600px)": {
      maxHeight: "2em"
    }
  },
});
