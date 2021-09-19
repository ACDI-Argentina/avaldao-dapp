import React, { Component } from 'react'
import classNames from "classnames"
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { withStyles } from '@material-ui/core/styles'
import Header from "components/Header/Header.js"
import Footer from "components/Footer/Footer.js"
import Parallax from "components/Parallax/Parallax.js"
import MainMenu from 'components/MainMenu'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js"
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import { completarAval, selectAvalById } from '../../redux/reducers/avalesSlice'
import { Button } from '@material-ui/core'
import Aval from 'models/Aval'
import config from 'configuration'
import TextField from '@material-ui/core/TextField'
import Web3Utils from 'lib/blockchain/Web3Utils'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import InputAdornment from '@material-ui/core/InputAdornment'
import { history } from 'lib/helpers'
import FiatUtils from 'utils/FiatUtils'

/**
 * Pantalla para completar aval.
 * 
 */
class AvalCompletar extends Component {

  constructor(props) {
    super(props);

    const { aval, t } = props;

    this.state = {
      comercianteAddress: '',
      comercianteHelperText: t("avalComercianteAddressHelper"),
      comercianteError: false,
      avaladoAddress: '',
      avaladoHelperText: t("avalAvaladoAddressHelper"),
      avaldaoError: false,
      formValid: false,
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      aval: new Aval(aval),
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

  handleChangeComercianteAddress(event) {
    const { t } = this.props;
    let comercianteError = false;
    let comercianteHelperText = t('avalComercianteAddressHelper');
    const comercianteAddress = event.target.value;
    if (comercianteAddress === undefined || comercianteAddress === '') {
      comercianteHelperText = t('errorRequired');
      comercianteError = true;
    } else if (!Web3Utils.isValidAddress(comercianteAddress)) {
      comercianteHelperText = t('errorInvalidAddress');
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
    const { t } = this.props;
    let avaladoError = false;
    let avaladoHelperText = t('avalAvaladoAddressHelper');
    const avaladoAddress = event.target.value;
    if (avaladoAddress === undefined || avaladoAddress === '') {
      avaladoHelperText = t('errorRequired');
      avaladoError = true;
    } else if (!Web3Utils.isValidAddress(avaladoAddress)) {
      avaladoHelperText = t('errorInvalidAddress');
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
    const { comercianteAddress, avaladoAddress } = this.state;
    let formValid = true;
    if (comercianteAddress === undefined || comercianteAddress === '') {
      formValid = false;
    } else if (!Web3Utils.isValidAddress(comercianteAddress)) {
      formValid = false;
    }
    if (avaladoAddress === undefined || avaladoAddress === '') {
      formValid = false;
    } else if (!Web3Utils.isValidAddress(avaladoAddress)) {
      formValid = false;
    }
    this.setState({
      formValid: formValid
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
      this.props.completarAval(this.state.aval);
      history.push(`/avales`);
    });
    event.preventDefault();
  }

  cancel() {
    history.push(`/avales`);
  }

  render() {
    const { aval,
      comercianteHelperText,
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
                  {t('avalCompletarTitle')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="proyectoTextField"
                  value={aval.proyecto}
                  label={t('avalProyecto')}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <TextField
                  id="propositoTextField"
                  value={aval.proposito}
                  label={t('avalProposito')}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <TextField
                  id="causaTextField"
                  value={aval.causa}
                  label={t('avalCausa')}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={3}>
                <TextField
                  id="adquisicionTextField"
                  value={aval.adquisicion}
                  label={t('avalAdquisicion')}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={3}>
                <TextField
                  id="beneficiariosTextField"
                  value={aval.beneficiarios}
                  label={t('avalBeneficiarios')}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={3}>
                <TextField
                  id="montoTextField"
                  value={FiatUtils.format(aval.monto)}
                  label={t('avalMonto')}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={3}>
                <TextField
                  id="cuotasCantidadTextField"
                  value={aval.cuotasCantidad}
                  label={t('avalCuotasCantidad')}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <TextField
                  id="comercianteAddressTextField"
                  value={this.state.comercianteAddress}
                  onChange={this.handleChangeComercianteAddress}
                  label={t('avalComercianteAddress')}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalanceWalletIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <TextField id="avaladoAddressTextField"
                  value={this.state.avaladoAddress}
                  onChange={this.handleChangeAvaladoAddress}
                  label={t('avalAvaladoAddress')}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalanceWalletIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!formValid}
                  className={classes.button}>
                  {t('avalCompletar')}
                </Button>
                <Button
                  onClick={this.cancel}
                  className={classes.button}>
                  {t('avalCancelar')}
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

AvalCompletar.contextType = Web3AppContext;

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
  const avalId = ownProps.match.params.id;
  return {
    aval: selectAvalById(state, avalId),
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { completarAval }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(AvalCompletar)))
);