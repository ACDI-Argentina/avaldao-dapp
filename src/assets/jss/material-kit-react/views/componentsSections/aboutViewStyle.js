import { title, primaryColor } from "assets/jss/material-kit-react.js";

const aboutViewStyle = {

  color: "#999",

  section: {
    padding: "0",
    textAlign: "left",
    marginTop: "5em"
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
    textAlign: "justify",
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
  },
  sectionGlass: {
    border: '1px solid #FFF',
    borderRadius: '5px',
    padding: "2em",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(5px)"

  }
};

export default aboutViewStyle;
