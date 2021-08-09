import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import StatusIndicator from 'components/StatusIndicator';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import { history } from 'lib/helpers';
import AvaldaoContractApi from 'lib/blockchain/AvaldaoContractApi';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';

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
    history.push(`/aval-completar/${aval.clientId}`);
  }

  firmar() {
    const { currentUser, aval } = this.props;
    AvaldaoContractApi.sign(currentUser.address, aval).subscribe(aval => {
      console.log('Firmado', aval);
    });
  }

  render() {

    const { aval, classes, t } = this.props;

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
                disabled={!aval.allowCompletar()}>
                <AssignmentTurnedInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('avalFirmarTitle')}>
              <IconButton
                edge="end"
                aria-label="firmar"
                color="primary"
                onClick={this.firmar}
                disabled={!aval.allowFirmar()}>
                <VpnKeyIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />
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

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(AvalItem)))
);