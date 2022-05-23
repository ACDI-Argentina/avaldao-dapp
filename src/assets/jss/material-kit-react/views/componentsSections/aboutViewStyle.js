import { title, primaryColor } from "assets/jss/material-kit-react.js";

const aboutViewStyle = {

  color: "#999",

  section: {
    padding: "0",
    textAlign: "left",
    marginTop: "5em"
  },
  titleLeftBar: {
    marginBottom: "2em"
  },
  pageTitle: {
    color: "#7868E5",
    /*fontWeight: "bold",
    padding: "1em 2em",*/
  },
  leftTitle: {
    color: "#7868E5",
    fontWeight: "bold",
    paddingLeft: "2em",
    paddingRight: "1em"
  },
  leftBar: {
    borderLeft: "1em solid #7868E5",
    marginBottom: "3em"
  },

  paragraphText: {
    fontSize: "0.9em",
    lineHeight: "2",
    marginBottom: "4em",
    textAlign: "justify"
  },
  roadMapCard: {
    border: "1px solid #7868E5",
    borderRadius: "8px",
    padding: "1em 1.5em",
    margin: "1em"
  },
  roadMapTitle: {
    fontWeight: "bold",
    fontSize: ".9em"
  },
  roadMapText: {
    fontSize: ".8em"
  },
  roadMapCurrentText: {
    fontWeight: "bold",
    color: "#7868E5",
    textTransform: "uppercase",
  },
  image: {
    width: "20%",
    maxWidth: "80px",
    "@media (max-width: 600px)": {
      marginLeft: "20%"
    }
  },
  sectionTitle: {
    color: "#000",
    fontWeight: "bold",
    marginTop: "0.5em",
    marginBottom: "0.5em",
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
  underlineHighlight: {
    textDecoration: "underline",
    textDecorationColor: "#10B363"
  },
  colorHighlight: {
    color: primaryColor
  },
  boldText: {
    fontWeight: "600"
  },
  italicText: {
    fontStyle: "italic"
  }
};

export default aboutViewStyle;
