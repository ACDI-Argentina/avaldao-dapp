import React, { Component } from 'react';
import { registerCurrentUser, selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import { saveAval, selectAvales } from '../../redux/reducers/avalesSlice'
import Aval from 'models/Aval';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import StatusIndicator from 'components/StatusIndicator';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import { history } from 'lib/helpers';
import AvalItem from './AvalItem';
//import { history } from '../lib/helpers'

/**
 * Pantalla con el listado de avales.
 * 
 */
class Avales extends Component {

  constructor(props) {
    super(props);

    const { t } = props;

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

  goAvalCompletar(aval) {
    history.push(`/aval-completar/${aval.clientId}`);
  }

  render() {

    const { avales, classes, t, ...rest } = this.props;

    return (
      <div className={classes.root}>
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
              <Typography variant="h5" component="h5">
                {t('avalesTitle')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <List className={classes.list}>
                {avales.map(aval => (
                  <AvalItem aval={aval}></AvalItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </div>
        <Footer />
      </div>
    );
  }
}

Avales.contextType = Web3AppContext;

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
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    avales: selectAvales(state),
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { registerCurrentUser, saveAval }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(Avales)))
);