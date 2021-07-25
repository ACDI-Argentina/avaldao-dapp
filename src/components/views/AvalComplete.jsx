import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from "classnames";

import { history } from '../../lib/helpers';
import { registerCurrentUser, selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import { container, title } from "assets/jss/material-kit-react.js";
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";
import ProfileForm from 'components/ProfileForm';
import Loader from '../Loader';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';

import { saveAval } from '../../redux/reducers/avalesSlice'
import { Button } from '@material-ui/core';
import Aval from 'models/Aval';

/**
 * Pantalla para completar aval.
 * 
 */
class AvalComplete extends Component {

  constructor(props) {
    super(props);

    const aval = new Aval();

    this.state = {
      avaldaoAddress: '0xb2e09ab18a1792025D8505B5722E527d5e90c8e7',
      solicitanteAddress: '0xee4b388fb98420811C9e04AE8378330C05A2735a',
      comercianteAddress: '',
      avaladoAddress: '',
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      aval: aval,
      isBlocking: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeComercianteAddress = this.handleChangeComercianteAddress.bind(this);
    this.handleChangeAvaladoAddress = this.handleChangeAvaladoAddress.bind(this);
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
    const { history, currentUser, t: translate } = this.props;
    const { loginAccount } = this.context;
    const { authenticateIfPossible } = this.context.modals.methods;

    const goHome = () => history.push('/');

    if (!currentUser || !currentUser.address) {
      const confirmation = await this.requestConnection(translate);
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

  handleChangeComercianteAddress(event) {
    this.setState({
      comercianteAddress: event.target.value
    });
  }

  handleChangeAvaladoAddress(event) {
    this.setState({
      avaladoAddress: event.target.value
    });
  }

  handleSubmit(event) {    
    let aval = this.state.aval;
    aval.avaldaoAddress = this.state.avaldaoAddress;
    aval.solicitanteAddress = this.state.solicitanteAddress;
    aval.comercianteAddress = this.state.comercianteAddress;
    aval.avaladoAddress = this.state.avaladoAddress;
    this.setState({
      isSaving: true,
      aval: aval
    }, () => {
      this.props.saveAval(this.state.aval);
      //history.push(`/`);
    });
    event.preventDefault();
  }

  render() {
    const { isLoading } = this.state;
    const { currentUser } = this.props;
    const { ...rest } = this.props;
    const { classes, t } = this.props;

    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );


    return (
      <div className={classes.profilePage}>
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






        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div>
                      <img src={currentUser.avatar ? currentUser.avatar : require("assets/img/default-user-icon.png")} alt="..." className={imageClasses} />
                    </div>

                    <form onSubmit={this.handleSubmit} className={classes.form} noValidate autoComplete="off" >
                      <Input value={this.state.comercianteAddress}
                        onChange={this.handleChangeComercianteAddress}
                        placeholder="Dirección del comerciante"
                        defaultValue="Hello world"
                        inputProps={{ 'aria-label': 'description' }} />
                      <Input value={this.state.avaladoAddress}
                        onChange={this.handleChangeAvaladoAddress}
                        placeholder="Dirección del avalado"
                        inputProps={{ 'aria-label': 'description' }} />
                      <Input defaultValue="Disabled" disabled inputProps={{ 'aria-label': 'description' }} />
                      <Input defaultValue="Error" error inputProps={{ 'aria-label': 'description' }} />

                      <Button variant="contained" color="primary" type="submit">
                        Completar
                      </Button>
                    </form>


                    {isLoading && <Loader className="fixed" />}
                    {!isLoading && (
                      <div>
                        {currentUser.email && <h3>Edit your profile</h3>}
                        {!currentUser.email && <h3>Create a profile to get started</h3>}
                        <p>
                          <i className="fa fa-question-circle" />
                          Trust is important to run successful Funds or Campaigns. Without trust you will
                          likely not receive donations. Therefore, we strongly recommend that you{' '}
                          <strong>fill out your profile </strong>
                          when you want to start Funds or Campaigns on the B4H dapp.
                        </p>
                        <div className="alert alert-warning">
                          <i className="fa fa-exclamation-triangle" />
                          Please note that all the information entered will be stored on a publicly
                          accessible permanent storage like blockchain. We are not able to erase or alter
                          any of the information.{' '}
                          <strong>
                            Do not input anything that you do not have permision to share or you are not
                            comfortable with being forever accessible.
                          </strong>{' '}
                          For more information please see our{' '}
                          <Link to="/termsandconditions">Terms and Conditions</Link> and{' '}
                          <Link to="/privacypolicy">Privacy Policy</Link>.
                        </div>

                        <ProfileForm user={currentUser} />
                      </div>
                    )}

                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

AvalComplete.contextType = Web3AppContext;

const styles = theme => ({
  form: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  profilePage: {
    overflowX: "hidden",
  },
  container,
  profile: {
    textAlign: "center",
    "& img": {
      maxWidth: "160px",
      width: "100%",
      margin: "0 auto",
      transform: "translate3d(0, -50%, 0)"
    }
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
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
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
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { registerCurrentUser, saveAval }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(AvalComplete)))
);