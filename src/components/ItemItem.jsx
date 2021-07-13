import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Item from '../models/Item';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import DateViewer from './DateViewer';

class ItemItem extends Component {

  render() {
    const { item, classes } = this.props;
    return (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar variant="rounded" alt="Remy Sharp" src={item.imageSrc} className={classes.large} />
        </ListItemAvatar>
        <ListItemText
          primary={item.description}
          secondary={
            <DateViewer value={item.date} />
          }
        />
      </ListItem>
    );
  }
}

ItemItem.propTypes = {
  item: PropTypes.instanceOf(Item).isRequired
};

const styles = theme => ({
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  }
});

export default withStyles(styles)(ItemItem);
