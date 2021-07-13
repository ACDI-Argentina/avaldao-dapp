import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ItemItem from './ItemItem';
import Container from '@material-ui/core/Container';
import { withTranslation } from 'react-i18next';
import Item from '../models/Item';

class ItemList extends Component {

  render() {
    const { items, classes} = this.props;
    return (
      <Container fixed>
        <List className={classes.root}>
          {items.map(item => (
            <ItemItem key={item.clientId} item={item}></ItemItem>
          ))}
        </List>
      </Container>
    );
  }
}

ItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.instanceOf(Item)).isRequired
};

const styles = {
  root: {
    width: '100%'
  },
  inline: {
    display: 'inline'
  }
};

export default withStyles(styles)(
  withTranslation()(ItemList)
);
