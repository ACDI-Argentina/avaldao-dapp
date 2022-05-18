import { title, primaryColor } from "assets/jss/material-kit-react.js";

import bkgImg from "assets/img/operationBg.jpg";

const platformOperationStyle = {

  color: "#999",

  section: {
    textAlign: "center",
    padding: "4em",
    backgroundImage: "url(" + bkgImg + ")",
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center center',
    backgroundSize: '10%'
  },
  sectionGlass: {
    border: '1px solid #FFF',
    borderRadius: '5px',
    padding: "2em",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(5px)"

  },
  title: {
    ...title,
    minHeight: "32px",
    textDecoration: "none",
    color: "#FFF",
    width: "50%",
    fontWeight: "600",
    margin: "0 auto 0.5em auto"
  },
  description: {
    color: "#000",
    width: "40%",
    margin: "0 auto 1em auto",
    fontWeight: "normal"
  },
  donut: {
    position: "relative",
    top: "-20px",
    left: "0",
    maxWidth: "15%",
  },
  operationDescription: {
    backgroundColor: "#FFF",
  },
  operationDescriptionImg: {
    maxWidth: "90%",
    height: "auto"
  },
  sectionTitle: {
    color: primaryColor,
    fontWeight: "bold",
    fontSize: "1.4em",
    marginBottom: "1em",
    "@media (max-width: 600px)": {
      maxWidth: "60%",
      marginLeft: "20%"
    }
  },
  sectionDescription: {
    color: "#000",
    fontWeight: "normal",
    "@media (max-width: 600px)": {
      maxWidth: "60%",
      marginLeft: "20%"
    }
  },
  disabledCard: {
    color: "#AAA",
  }
};

export default platformOperationStyle;
