import React, { Component } from 'react';
import classNames from "classnames";
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
import { saveAval } from '../../redux/reducers/avalesSlice'
import { Button } from '@material-ui/core';
import Aval from 'models/Aval';
import config from 'configuration';
import TextField from '@material-ui/core/TextField';
import Web3Utils from 'lib/blockchain/Web3Utils';

/**
 * Pantalla para completar aval.
 * 
 */
class AvalComplete extends Component {

  constructor(props) {
    super(props);

    const aval = new Aval();

    this.state = {
      comercianteAddress: '',
      comercianteHelperText: 'Dirección de la wallet del comerciante',
      comercianteError: false,
      avaladoAddress: '',
      avaladoHelperText: 'Dirección de la wallet del avalado',
      avaldaoError: false,
      formValid: false,
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      aval: aval,
      isBlocking: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeComercianteAddress = this.handleChangeComercianteAddress.bind(this);
    this.handleChangeAvaladoAddress = this.handleChangeAvaladoAddress.bind(this);
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
    let comercianteError = false;
    let comercianteHelperText = 'Dirección de la wallet del comerciante';
    const comercianteAddress = event.target.value;
    if (comercianteAddress === undefined || comercianteAddress === '') {
      comercianteHelperText = 'Requerido';
      comercianteError = true;
    } else if (!Web3Utils.isValidAddress(comercianteAddress)) {
      comercianteHelperText = 'Dirección inválida';
      comercianteError = true;
    }
    this.setState({
      comercianteAddress: comercianteAddress,
      comercianteHelperText: comercianteHelperText,
      comercianteError: comercianteError
    }, () => {
      this.setFormValid();
    });
  }

  handleChangeAvaladoAddress(event) {
    let avaladoError = false;
    let avaladoHelperText = 'Dirección de la wallet del avalado';
    const avaladoAddress = event.target.value;
    if (avaladoAddress === undefined || avaladoAddress === '') {
      avaladoHelperText = 'Requerido';
      avaladoError = true;
    } else if (!Web3Utils.isValidAddress(avaladoAddress)) {
      avaladoHelperText = 'Dirección inválida';
      avaladoError = true;
    }
    this.setState({
      avaladoAddress: avaladoAddress,
      avaladoHelperText: avaladoHelperText,
      avaladoError: avaladoError
    }, () => {
      this.setFormValid();
    });
  }

  setFormValid() {
    const { comercianteError, avaladoError } = this.state;
    this.setState({
      formValid: !comercianteError && !avaladoError
    });
  }

  handleSubmit(event) {
    const { currentUser } = this.props;
    let aval = this.state.aval;
    aval.avaldaoAddress = config.avaldaoAddress;
    aval.solicitanteAddress = currentUser.address;
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
    const { comercianteHelperText,
      comercianteError,
      avaladoHelperText,
      avaladoError,
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
                  Completar aval
                </Typography>
              </Grid>
              <Grid item sm={12} md={6}>
                <TextField
                  id="comercianteAddressTextField"
                  value={this.state.comercianteAddress}
                  onChange={this.handleChangeComercianteAddress}
                  label="Dirección del comerciante"
                  helperText={comercianteHelperText}
                  placeholder="0x..."
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={comercianteError}
                  required
                  inputProps={{ maxlength: 42 }}
                  variant="filled"
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <TextField id="avaladoAddressTextField"
                  value={this.state.avaladoAddress}
                  onChange={this.handleChangeAvaladoAddress}
                  label="Dirección del avalado"
                  helperText={avaladoHelperText}
                  placeholder="0x..."
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={avaladoError}
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
                  disabled={!formValid}>
                  Completar
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

AvalComplete.contextType = Web3AppContext;

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
  }
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