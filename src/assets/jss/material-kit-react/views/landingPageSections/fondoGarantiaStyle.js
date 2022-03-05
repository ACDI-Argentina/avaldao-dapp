import {  primaryColor } from "assets/jss/material-kit-react.js";

const color = "#FFF";

const platformFeaturesStyle = {

  subtitle: {
    minHeight: "32px",
    textDecoration: "none",
    color: color,
    textAlign: "left",
    margin: "0 auto 0.5em auto",
    fontWeight: "600"
  },
  description: {
    color: color,
    margin: "0 auto 1em auto",
    fontWeight: "normal"
  },
  rightImage: {
    width: "100%",
    maxWidth: "300px",
    "@media (max-width: 960px)": {
      display: "none"
    }
  }
};

export default platformFeaturesStyle;
