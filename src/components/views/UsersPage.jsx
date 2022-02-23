import React, { Component } from 'react';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import MainMenu from 'components/MainMenu';
import Grid from '@material-ui/core/Grid';
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import UserTable from './UserTable';

/**
 * Pantalla de Usuarios.
 * 
 */
class UsersPage extends Component {

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

  render() {

    const { classes, t, ...rest } = this.props;

    return (
      <div className={classes.root}>
        <Header
          color="white"
          brand={<img src={require("assets/img/logos/avaldao.svg")}
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

        <div className={classes.panel}>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <UserTable/>
            </Grid>
          </Grid>
        </div>
        <Footer />
      </div>
    );
  }
}

UsersPage.contextType = Web3AppContext;

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
  panel: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3",
    margin: "0px 30px 0px",
    padding: '2em',
    flexGrow: 1,
    minHeight: "75vh",
    margin: "100px auto 0px",
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
  withTranslation()(UsersPage)))
);