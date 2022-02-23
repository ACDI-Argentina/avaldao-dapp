import { fontSize } from "styled-system";

const footerStyle = {

  color: "#999",

  section: {
    color: "#000",
    padding: "0",
    textAlign: "left",
    marginTop: "2em",
    backgroundColor: "#7868E5"
  },
  dappLogo: {
    padding: "1em",
    width: "100%",
    textAlign: "left",
    maxHeight: "80px"
  },
  leftSection: {
    "@media (max-width: 600px)": {
      textAlign: "left"
    }
  },
  rightSection: {
    borderLeft: "2px solid #999",
    alignSelf: "center",
    padding: "1em",
    "@media (max-width: 600px)": {
      borderLeft: "0px",
      paddingLeft: "0em"
    }
  },
  title: {
    color: "#10B363",
    fontWeight: "bold",
    margin: "0",
    marginBottom: "0.5em"
  },
  description: {
    color: "#000",
    fontWeight: "normal",
    margin: "0"
  },
  disclaimer: {
    color: "#FFF",
    fontWeight: "normal",
    padding: "1em",
    textAlign: "center",
    fontSize: ".8em",
    margin: "0px"
  },
  logo: {
    width: "75%",
    textAlign: "center",
    maxWidth: "100px"
  },
  smallLogo: {
    maxWidth: "30px",
    marginRight: "10px"
  }
};

export default footerStyle;
