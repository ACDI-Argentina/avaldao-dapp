import React, { Component } from 'react';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import Grid from '@material-ui/core/Grid';
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import FondoGarantia from './FondoGarantia';
import Avales from './Avales';
import Divider from '@material-ui/core/Divider'

/**
 * Pantalla Home.
 * 
 */
class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      isBlocking: false
    };
  }

  async requestConnection(translate) {

    const labels = {
      title: translate("requestConnectionTitle"),
      text: translate("requestConnectionText"),
      cancel: translate("requestConnectionCancel"),
      ok: translate("requestConnectionOk"),
    }

    const confirm = await React.swal({
      icon: 'info',
      title: labels.title,
      text: labels.text,

      buttons: [labels.cancel, labels.ok],
      closeOnClickOutside: false,
    });

    return confirm;
  }

  async componentDidMount() {
    const { history, currentUser, t } = this.props;
    const { loginAccount } = this.context;
    const { authenticateIfPossible } = this.context.modals.methods;

    const goHome = () => history.push('/');

    if (!currentUser || !currentUser.address) {
      const confirmation = await this.requestConnection(t);
      if (confirmation) {
        const connected = await loginAccount();
        if (!connected) {
          return goHome();
        }
      } else {
        return goHome();
      }
    }

    authenticateIfPossible(this.props.currentUser)
      .then(() => this.setState({ isLoading: false }))
      .catch(err => {
        if (err === 'noBalance') {
          history.goBack();
        } else {
          this.setState({ isLoading: false });
        }
      });
  }

  render() {

    const { classes, t, ...rest } = this.props;

    return (
      <div className={classes.root}>
        {/* <AvalStoreInspector /> */}
        <Header
          color="white"
          brand={<img src={require("assets/img/logos/give4forest.png")}
            alt={t('give4forest')}
            className={classes.dappLogo} />}
          rightLinks={<MainMenu />}
          fixed
          changeColorOnScroll={{
            height: 0,
            color: "white"
          }}
          {...rest}
        />
        <Parallax small image={require("assets/img/profile-default-bg.jpg")} />

        <div className={classes.panel}>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FondoGarantia></FondoGarantia>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Avales></Avales>
            </Grid>
          </Grid>
        </div>
        <Footer />
      </div>
    );
  }
}

Home.contextType = Web3AppContext;

const styles = theme => ({
  root: {
    overflowX: "hidden"
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  description: {
    margin: "1.071rem auto 0",
    maxWidth: "600px",
    color: "#999",
    textAlign: "center !important"
  },
  name: {
    marginTop: "-80px"
  },
  ...imagesStyle,
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
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
    flexGrow: 1
  },
  socials: {
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
    color: "#999"
  },
  navWrapper: {
    margin: "20px auto 50px auto",
    textAlign: "center"
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
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  button: {
    margin: theme.spacing(1),
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(Home)))
);