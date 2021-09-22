import React, { Component } from 'react';
import classNames from "classnames";
import { registerCurrentUser, selectCurrentUser } from '../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { Button } from '@material-ui/core';
import User from 'models/User';
import TextField from '@material-ui/core/TextField';
import { history } from 'lib/helpers';

import validatorUtils from 'lib/blockchain/ValidatorUtils';
import Avatar from './Avatar/Avatar';
//import Avatar from "react-avatar-edit";


/**
 * Formulario de perfil de usuario.
 * 
 */
class UserProfile extends Component {

  constructor(props) {
    super(props);

    const { currentUser, t } = props;

    this.state = {
      name: currentUser.name,
      email: currentUser.email,
      url: currentUser.url,
      avatar: null,
      avatarPreview: null,
      user: new User(currentUser),
      avatarImg: currentUser.avatarCidUrl,

      registered: false,
      nameHelperText: '',
      nameError: false,
      emailHelperText: '',
      urlHelperText: '',
      formValid: false,
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      isBlocking: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
    this.setFormValid = this.setFormValid.bind(this);

    this.onCrop = this.onCrop.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)
  }

  /* componentDidMount() {
    if (this.props.address) {
      this.props.fetchUserByAddress(this.props.address);
    }
  } */


  clearForm() {
    this.setState({
      name: "",
      email: "",
      url: "",
      user: new User(this.props.currentUser)
    })
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

  async componentDidMount() {//Did mount, que pasa si el usuario no esta autenticado? no le va a pedir que se autentique?
    console.log(`[UserProfile] componentDidMount`)
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

    this.setFormValid();
  }

  async componentDidUpdate(prevProps, prevState) {
    const userHasUpdated = prevProps.currentUser !== this.props.currentUser;

    const prevAddress = prevProps.currentUser && prevProps.currentUser.address;
    const nextAddress = this.props.currentUser && this.props.currentUser.address;

    const userHasChanged = prevAddress && nextAddress && (prevAddress !== nextAddress);
    const userHasDisconnected = this.props.currentUser.address === null && prevProps.currentUser.address != undefined;
    
    const statusHasChanged = this.props.currentUser.status !== prevProps.currentUser.status;
    if (statusHasChanged) {
      const isRegistering = this.props.currentUser?.status?.name === "Registering";
      this.setState({ isSaving: isRegistering });
    }


    if (userHasDisconnected || userHasChanged) {
      this.clearForm();
    }


    if (userHasUpdated) {
      console.log(`[User profile] Load current user addrss - ${this.props.currentUser?.address}`);

      const { name, email, url, registered } = this.props.currentUser;
      const avatarCidUrl = this.props.currentUser?.avatarCidUrl;

      const state = {};
      if (name) {
        state.name = name;
      }
      if (email) {
        state.email = email;
      }
      if (url) {
        state.url = url;
      }
      if (avatarCidUrl) {
        state.avatarImg = avatarCidUrl;
      }

      this.setState({ ...state, registered, user: new User(this.props.currentUser) })
    }

  }

  handleChangeName(event) {
    const { t } = this.props;
    let nameError = false;
    let nameHelperText = '';
    const name = event.target.value;
    if (name === undefined || name === '') {
      nameHelperText = t('errorRequired');
      nameError = true;
    }
    this.setState({
      name: name,
      nameHelperText: nameHelperText,
      nameError: nameError
    }, () => {
      this.setFormValid();
    });
  }

  handleChangeEmail(event) {
    const { t } = this.props;
    let emailError = false;
    let emailHelperText = '';
    const email = event.target.value;
    if (email === undefined || email === '') {
      emailHelperText = t('errorRequired');
      emailError = true;
    } else if (!validatorUtils.isValidEmail(email)) {
      emailHelperText = t('errorInvalidEmail');
      emailError = true;
    }
    this.setState({
      email: email,
      emailHelperText: emailHelperText,
      emailError: emailError
    }, () => {
      this.setFormValid();
    });
  }

  handleChangeUrl(event) {
    const { t } = this.props;
    let urlError = false;
    let urlHelperText = '';
    const url = event.target.value;
    if (url === undefined || url === '') {
      urlHelperText = t('errorRequired');
      urlError = true;
    } else if (!validatorUtils.isValidUrl(url)) {
      urlHelperText = t('errorInvalidUrl');
      urlError = true;
    }
    this.setState({
      url: url,
      urlHelperText: urlHelperText,
      urlError: urlError
    }, () => {
      this.setFormValid();
    });
  }

  handleChangeAvatar(avatar) {
    this.setState({
      avatar: avatar
    }, () => {
      this.setFormValid();
    });
  }

  onClose() {
    this.setState({ avatarPreview: null })
  }

  onCrop(avatarPreview) {
    if (avatarPreview) {
      this.setState({ avatarPreview })
    }
  }

  onBeforeFileLoad(elem) {
    if (elem.target.files[0].size > 71680) {
      //alert("File is too big!");
      //elem.target.value = "";
    };

    this.setState({
      avatarCropRadius: undefined
    })
  }

  setFormValid() {
    const { name, email, url } = this.state;
    let formValid = true;
    if (name === undefined || name === '') {
      formValid = false;
    }
    if (email === undefined || email === '') {
      formValid = false;
    } else if (!validatorUtils.isValidEmail(email)) {
      formValid = false;
    }
    if (url === undefined || url === '') {
      formValid = false;
    } else if (!validatorUtils.isValidUrl(url)) {
      formValid = false;
    }
    this.setState({
      formValid: formValid
    });
  }

  async handleSubmit(event) {
    const { authenticateIfPossible } = this.context.modals.methods;

    event.preventDefault();

    const { currentUser } = this.props;
    let user = this.state.user;
    user.address = currentUser.address;
    user.name = this.state.name;
    user.email = this.state.email;
    user.url = this.state.url;
    user.avatar = this.state.avatarPreview;

    if (!currentUser.authenticated) {
      const result = await authenticateIfPossible(this.props.currentUser);

      if (!result) {
        console.log("User not authenticated!"); //Throw error?
        return;
      }
    }

    this.setState({ isSaving: true, user: user }, () => {
      console.log(`[UserProfile] handleSubmit`, user)

      this.props.registerCurrentUser(this.state.user);
      //history.push(`/`);
    });

  }

  cancel() {
    history.push(`/`);
  }

  render() {
    const { user,
      nameHelperText,
      nameError,
      emailHelperText,
      emailError,
      urlHelperText,
      urlError,
      formValid,
      avatarImg,
      isSaving
    } = this.state;
    const { currentUser, classes, t, ...rest } = this.props;

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

        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>User registered: {this.state.registered? `true`:`false`}</div>
          <div>User authenticated: {this.state.user.authenticated? `true`:`false`}</div>

          <form onSubmit={this.handleSubmit}
            className={classes.form}
            noValidate
            autoComplete="off" >

            <Grid container spacing={2} style={{ margin: "0px" }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5">
                  {t('userProfileTitle')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={5} spacing={0}>
                <div className={classes.avatarContainer}>
                  {/*      {<Avatar
                    img={avatarImg}
                    label={t('userAvatarChoose')}
                    width={avatarImgWidth}
                    imageWidth={avatarImgWidth}
                    cropRadius={avatarCropRadius}
                    onCrop={this.onCrop}
                    onClose={this.onClose}
                    onBeforeFileLoad={this.onBeforeFileLoad}
                  />}  
                  "https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
                  */}

                  <Avatar
                    imageSrc={avatarImg}
                    onCropped={(cropped) => {
                      this.setState({ avatarPreview: cropped })
                      this.setFormValid();
                    }}
                  />

                </div>
              </Grid>
              <Grid container spacing={3} xs={12} md={7}>
                <Grid item xs={12} md={12}>
                  <TextField
                    id="nameTextField"
                    value={this.state.name}
                    onChange={this.handleChangeName}
                    label={t('userName')}
                    helperText={nameHelperText}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={nameError}
                    required
                    inputProps={{ maxLength: 42 }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField id="emailTextField"
                    value={this.state.email}
                    onChange={this.handleChangeEmail}
                    label={t('userEmail')}
                    helperText={emailHelperText}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={emailError}
                    required
                    inputProps={{ maxLength: 42 }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField id="urlTextField"
                    value={this.state.url}
                    onChange={this.handleChangeUrl}
                    label={t('userUrl')}
                    helperText={urlHelperText}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={urlError}
                    required
                    inputProps={{ maxLength: 42 }}
                  />
                </Grid>
              </Grid>
              <Grid 
                container 
                xs={12} 
                md={4} 
                justifyContent={"center"} 
              >
                <div style={{paddingTop: "25px", display: "flex", alignItems: "center" }}>
                  <div style={{position:'relative'}}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!formValid || isSaving}
                      className={classes.button}>
                      {t('save')}
                    </Button>
                    {isSaving && (
                      <div style={{
                          position:'absolute', 
                          right:"0px",
                          top: "0px",
                          bottom: "0px", 
                          left: "0px", 
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}>
                        <CircularProgress 
                          color={"primary"}
                          size={"20px"}
                          thickness={5}
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={this.cancel}
                    className={classes.button}>
                    {t('cancel')}
                  </Button>
                </div>
              </Grid>
            </Grid>

          </form>
        </div>
        <Footer />
      </div>
    );
  }
}

UserProfile.contextType = Web3AppContext;

const styles = theme => ({
  root: {
    overflowX: "hidden",
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
    },
    padding: '2em',
    flexGrow: 1
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
    margin: "-60px 80px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    "@media (max-width: 900px)": {
      margin: "-60px 20px 0px",
    }
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
  },
  avatarContainer: {
    width: "100%",
    height: "100%",
    minHeight: "325px",

    "@media (max-width: 950px)": {
      display: "flex",
      justifyContent: "center",
    }
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { registerCurrentUser }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(UserProfile)))
);