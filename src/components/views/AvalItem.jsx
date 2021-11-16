import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid'
import ListItemText from '@material-ui/core/ListItemText'
import StatusIndicator from 'components/StatusIndicator'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import PageviewIcon from '@material-ui/icons/Pageview'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import IconButton from '@material-ui/core/IconButton'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Tooltip from '@material-ui/core/Tooltip'
import { history } from 'lib/helpers'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { selectFondoGarantiaBalanceFiat } from '../../redux/reducers/fondoGarantiaSlice'
import ProfileSignature from './ProfileSignature'
import { firmarAval, desbloquearAval } from '../../redux/reducers/avalesSlice'
import FiatAmount from 'components/FiatAmount'
import FiatUtils from 'utils/FiatUtils'

/**
 * Item de un Aval
 * 
 */
class AvalItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
    this.goVisualizar = this.goVisualizar.bind(this);
    this.goCompletar = this.goCompletar.bind(this);
    this.firmar = this.firmar.bind(this);
    this.desbloquear = this.desbloquear.bind(this);
  }

  componentDidMount() {
    
  }

  goVisualizar() {
    const { aval } = this.props;
    history.push(`/aval-visualizar/${aval.id}`);
  }

  goCompletar() {
    const { aval } = this.props;
    history.push(`/aval-completar/${aval.id}`);
  }

  firmar() {
    const { currentUser, aval, firmarAval, t } = this.props;
    firmarAval({
      aval: aval,
      signerAddress: currentUser.address
    })
  }

  desbloquear() {
    const { currentUser, aval, desbloquearAval, t } = this.props;
    desbloquearAval({
      aval: aval
    })
  }

  render() {

    const { currentUser, aval, classes, t, fondoGarantiaBalanceFiat } = this.props;
    
    let allowFirmar = aval.allowFirmar(currentUser);
    let alertMessage = null;
    if (fondoGarantiaBalanceFiat.isLessThan(aval.montoFiat)) {
      const diff = aval.montoFiat.minus(fondoGarantiaBalanceFiat);
      alertMessage = t('avalFondosInsuficientes', {
        diff: FiatUtils.format(diff)
      });
      if (aval.isAvaldao(currentUser)) {
        // Cuando el usuario es Avaldao, no puede firmar si no hay fondos suficientes.
        allowFirmar = false;
      }
    }

    return (
      <React.Fragment>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={aval.proyecto}
            secondary={
              <React.Fragment>
                {aval.causa}
                <br></br>
                <FiatAmount amount={aval.montoFiat} />
                <br></br>
                <StatusIndicator status={aval.status}></StatusIndicator>

                <Grid container alignItems="center" style={{ marginTop: "0.5em" }} sm={10} spacing={3}>

                  <Grid item sm={12} md={3}>
                    <ProfileSignature
                      title={t("avaldao")}
                      address={aval.avaldaoAddress}
                      signature={aval.avaldaoSignature}
                    />
                  </Grid>

                  <Grid item sm={12} md={3}>
                    <ProfileSignature
                      title={t("solicitante")}
                      address={aval.solicitanteAddress}
                      signature={aval.solicitanteSignature}
                    />
                  </Grid>

                  <Grid item sm={12} md={3}>
                    <ProfileSignature
                      title={t("comerciante")}
                      address={aval.comercianteAddress}
                      signature={aval.comercianteSignature}
                    />
                  </Grid>

                  <Grid item sm={12} md={3}>
                    <ProfileSignature
                      title={t("avalado")}
                      address={aval.avaladoAddress}
                      signature={aval.avaladoSignature}
                    />
                  </Grid>
                </Grid>

                {(alertMessage &&
                  <Alert severity="warning">{alertMessage}</Alert>
                )}

              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title={t('avalVisualizarTitle')}>
              <IconButton
                edge="end"
                aria-label="visualizar"
                color="primary"
                onClick={this.goVisualizar}>
                <PageviewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('avalCompletarTitle')}>
              <IconButton
                edge="end"
                aria-label="completar"
                color="primary"
                onClick={this.goCompletar}
                disabled={!aval.allowCompletar(currentUser)}>
                <AssignmentTurnedInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('avalFirmarTitle')}>
              <IconButton
                edge="end"
                aria-label="firmar"
                color="primary"
                onClick={this.firmar}
                disabled={!allowFirmar}>
                <VpnKeyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('avalDesbloquearTitle')}>
              <IconButton
                edge="end"
                aria-label="desbloquear"
                color="primary"
                onClick={this.desbloquear}
                disabled={!aval.allowDesbloquear(currentUser)}>
                <LockOpenIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider component="li" />
      </React.Fragment>
    );
  }
}

AvalItem.contextType = Web3AppContext;

const styles = theme => ({


});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    fondoGarantiaBalanceFiat: selectFondoGarantiaBalanceFiat(state)
  };
}
const mapDispatchToProps = {
  firmarAval, desbloquearAval
}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(AvalItem)))
);