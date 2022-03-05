import { title } from "assets/jss/material-kit-react.js";

const color = "#FFF";

const bkgImg = require("assets/img/fondoGarantiaBg.png");

const platformFeaturesStyle = {

  section: {
    padding: "0",
    textAlign: "left",
    padding: "3em 4em",
    backgroundImage: "url(" + bkgImg + ")",
    backgroundSize: "cover",
    background: "linear-gradient(139.41deg, #292A6D 36.61%, #7868E5 66.43%, #63DFDF 92.6%)"
  },
  title: {
    ...title,
    minHeight: "32px",
    textDecoration: "none",
    color: color,
    textAlign: "center",
    margin: "0 auto 0.5em auto"
  }
};

export default platformFeaturesStyle;
