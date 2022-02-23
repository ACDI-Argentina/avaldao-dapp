import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { history } from 'lib/helpers'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'

/**
 * Item de un tarea sobre un aval.
 */
class AvalTaskItem extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.goVisualizar = this.goVisualizar.bind(this);
  }

  goVisualizar() {
    const { aval } = this.props;
    history.push(`/aval/${aval.id}/view`);
  }

  render() {

    const { aval, user, t } = this.props;

    const task = t(aval.getTaskCode(user));

    return (
      <ListItem>
        <ListItemText primary={aval.proyecto} secondary={task} />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="visualizar"
            color="primary"
            onClick={this.goVisualizar}>
            <SearchIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {

  };
}
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(AvalTaskItem)))
);