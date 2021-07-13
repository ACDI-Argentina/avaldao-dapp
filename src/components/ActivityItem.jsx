import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Activity from '../models/Activity';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import ActivityActionChip from './ActivityActionChip';
import DateTimeViewer from './DateTimeViewer';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ItemList from './ItemList';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import { withTranslation } from 'react-i18next';
import ProfileCardMini from './ProfileCardMini';

class ActivityItem extends Component {

  constructor() {
    super();
    this.state = {
      activities: {},
      isLoading: false,
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let open = this.props.activity.hasItems && !this.state.open;
    this.setState({
      open: open
    });
  };

  render() {
    const { open } = this.state;
    const { activity, classes, t } = this.props;
    return (
      <React.Fragment>
        <ListItem alignItems="flex-start" onClick={this.handleClick}>
          <ListItemAvatar>
            <ProfileCardMini address={activity.userAddress} namePosition="bottom"/>
          </ListItemAvatar>
          <ListItemText
            className={classes.text}
            primary={<ActivityActionChip activity={activity}></ActivityActionChip>}
            secondary={
              <React.Fragment>
                <Typography variant="body1" gutterBottom>
                  {activity.message}
                </Typography>
                <DateTimeViewer value={activity.createdAt} />
              </React.Fragment>
            }
          />
          {activity.hasItems && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Container className={classes.items} fixed>
            <Typography variant="overline">
              {t('attachements')}
            </Typography>
            <ItemList items={activity.items}></ItemList>
          </Container>
        </Collapse>
        <Divider />
      </React.Fragment>
    );
  }
}

ActivityItem.propTypes = {
  activity: PropTypes.instanceOf(Activity).isRequired
};

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  items: {
    paddingLeft: '6em'
  },
  inline: {
    display: 'inline',
  },
  text: {
    marginLeft: '2em'
  }
});

export default withStyles(styles)(
  withTranslation()(ActivityItem)
);
