import React from 'react'
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from 'react-i18next';

const Page = ({ children, ...props }) => {
  const classes = makeStyles(styles)();
  const { t } = useTranslation();

  //TODO: allow overwrite by props
  const brandSource = require("assets/img/logos/avaldao.svg");

  return (

    <div className={classes.root}>
      <Header
        color="white"
        brand={<img src={brandSource}
          alt={t('give4forest')}
          className={classes.dappLogo} />}
        fixed
        changeColorOnScroll={{
          height: 0,
          color: "white"
        }}
        {...props}
      />
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
    margin: "100px auto 0",
    padding: '0',
    flexGrow: 1,
    minHeight: "75vh",
    width: "100vw"

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
