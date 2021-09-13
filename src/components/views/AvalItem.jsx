import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import ListItemText from '@material-ui/core/ListItemText'
import StatusIndicator from 'components/StatusIndicator'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import IconButton from '@material-ui/core/IconButton'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Tooltip from '@material-ui/core/Tooltip'
import { history } from 'lib/helpers'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import ProfileSignature from './ProfileSignature'
import { firmarAval } from '../../redux/reducers/avalesSlice'

/**
 * Item de un Aval
 * 
 */
class AvalItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.goCompletar = this.goCompletar.bind(this);
    this.firmar = this.firmar.bind(this);
  }

  goCompletar() {
    const { aval } = this.props;
    history.push(`/aval-completar/${aval.id}`);
  }

  firmar() {
    const { currentUser, aval, firmarAval, t } = this.props;
    /*AvaldaoContractApi.sign(currentUser.address, aval).subscribe(aval => {
      console.log('Firmado', aval);
    });*/
    firmarAval({
      aval: aval,
      signerAddress: currentUser.address
    })
  }

  render() {

    const { currentUser, aval, classes, t } = this.props;

    return (
      <React.Fragment>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={aval.proyecto}
            secondary={
              <React.Fragment>
                {aval.causa}
                <br></br>
                <StatusIndicator status={aval.status}></StatusIndicator>

                <Grid container alignItems="center" style={{marginTop: "0.5em"}} sm={10} spacing={3}>

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

              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
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
                disabled={!aval.allowFirmar(currentUser)}>
                <VpnKeyIcon />
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
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = {
  firmarAval
}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(AvalItem)))
);