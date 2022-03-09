import { title } from "assets/jss/material-kit-react.js";

const homeCarouselStyle = {

  color: "#999",

  homeCarouselItem: {
    width: "100vw",
    minHeight: "70vh",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    paddingLeft: "15%",
  },
  title: {
    ...title,
    color: "#292A6D",
    fontSize: "2.5em",
    fontWeight: "600",
    marginBottom: "1em"
  },
  description: {
    color: "#454545",
    width: "40vw",
    fontSize: "1em",
    fontWeight: "normal",
    marginBottom: "2em"
  },
};

export default homeCarouselStyle;
