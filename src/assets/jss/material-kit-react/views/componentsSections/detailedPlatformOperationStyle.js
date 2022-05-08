import { title, primaryColor } from "assets/jss/material-kit-react.js";

import bkgImg from "assets/img/operationBg.jpg";

const platformOperationStyle = {

  color: "#999",

  section: {
    textAlign: "center",
    padding: "4em",
    backgroundColor: "#7868E5"
  },
  sectionGlass: {
    border: '1px solid #FFF',
    borderRadius: '5px',
    padding: "3em",
    background: "linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))",
    backdropFilter: "blur(5px)"
  },
  title: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "left"
  },
  description: {
    color: "#000",
    width: "40%",
    margin: "0 auto 1em auto",
    fontWeight: "normal"
  },
  paragraphText: {
    fontSize: "0.9em",
    lineHeight: "2",
    textAlign: "justify",
    color: "#FFF"
  },
  operationDescription: {
    backgroundColor: "#FFF",
  },
  operationDescriptionImg: {
    maxWidth: "90%",
    height: "auto"
  },
  cardMedia: {
    height: "200px",
    "@media (max-width: 1200px)": {
      height: "100px",
    }
  },
  cardContent: {
    padding: "2em",
    minHeight: "150px"
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: "1.1em"
  },
  cardDescription: {
    fontSize: ".9em"
  },
  cardQuestion: {
    fontWeight: "bold",
    fontSize: ".9em",
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
