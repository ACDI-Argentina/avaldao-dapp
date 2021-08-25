import React, { Component } from 'react';
import classNames from "classnames";
import { registerCurrentUser, selectCurrentUser } from '../redux/reducers/currentUserSlice';
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
import { Button } from '@material-ui/core';
import User from 'models/User';
import TextField from '@material-ui/core/TextField';
import { history } from 'lib/helpers';

/**
 * Formulario de perfil de usuario.
 * 
 */
class ProfileForm2 extends Component {

  constructor(props) {
    super(props);

    const { currentUser, t } = props;

    this.state = {
      name: currentUser.name,
      email: currentUser.email,
      url: currentUser.url,
      avatar: currentUser.avatar,
      user: new User(currentUser),

      nameHelperText: '',
      nameError: false,
      email: '',
      emailHelperText: '',
      url: '',
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
    this.setFormValid = this.setFormValid.bind(this);
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
    }
    this.setState({
      url: url,
      urlHelperText: urlHelperText,
      urlError: urlError
    }, () => {
      this.setFormValid();
    });
  }

  setFormValid() {
    const { name, email, url } = this.state;
    let formValid = true;
    if (name === undefined || name === '') {
      formValid = false;
    }
    if (email === undefined || email === '') {
      formValid = false;
    }
    if (url === undefined || url === '') {
      formValid = false;
    }
    this.setState({
      formValid: formValid
    });
  }

  handleSubmit(event) {
    const { currentUser } = this.props;
    let user = this.state.user;
    user.name = this.state.name;
    user.email = this.state.email;
    user.url = this.state.url;
    this.setState({
      isSaving: true,
      user: user
    }, () => {
      this.props.registerCurrentUser(this.state.user);
      history.push(`/`);
    });
    event.preventDefault();
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
      formValid } = this.state;
    const { classes, t, ...rest } = this.props;

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

          <form onSubmit={this.handleSubmit}
            className={classes.form}
            noValidate
            autoComplete="off" >

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5">
                  {t('userTitle')}
                </Typography>
              </Grid>
              <Grid item xs={12}>

              </Grid>
              <Grid item sm={12} md={6}>

              </Grid>
              <Grid item sm={12} md={6}>

              </Grid>
              <Grid item sm={12} md={4}>

              </Grid>
              <Grid item sm={12} md={4}>

              </Grid>
              <Grid item sm={12} md={4}>

              </Grid>
              <Grid item sm={12} md={6}>
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
                  inputProps={{ maxlength: 42 }}
                  variant="filled"
                />
              </Grid>
              <Grid item sm={12} md={6}>
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
                  inputProps={{ maxlength: 42 }}
                  variant="filled"
                />
              </Grid>
              <Grid item sm={12} md={6}>
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
                  inputProps={{ maxlength: 42 }}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!formValid}
                  className={classes.button}>
                  {t('save')}
                </Button>
                <Button
                  onClick={this.cancel}
                  className={classes.button}>
                  {t('cancel')}
                </Button>
              </Grid>
            </Grid>

          </form>
        </div>
        <Footer />
      </div>
    );
  }
}

ProfileForm2.contextType = Web3AppContext;

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
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
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
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { registerCurrentUser }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(ProfileForm2)))
);