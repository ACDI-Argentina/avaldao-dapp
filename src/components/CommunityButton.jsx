import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core';
class CommunityButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: 'external-link',
    };
  }

  componentWillMount() {
    // parse community icon from url

    const u = this.props.url;

    if (u.indexOf('slack') > -1) this.setState({ icon: 'fa-slack' });
    if (u.indexOf('reddit') > -1) this.setState({ icon: 'fa-reddit' });
    if (u.indexOf('facebook') > -1) this.setState({ icon: 'fa-facebook-square' });
    if (u.indexOf('github') > -1) this.setState({ icon: 'fa-github' });
    if (u.indexOf('twitter') > -1) this.setState({ icon: 'fa-twitter' });
    if (u.indexOf('linkedin') > -1) this.setState({ icon: 'fa-linkedin' });
  }

  render() {
    return (
      <Button className={this.props.className}
        rel="noopener noreferrer"
        size={this.props.size}
        variant={this.props.variant}
        color={this.props.color}
      >
        <Link href={this.props.url} target="_blank" underline="none" style={{color: "#555"}}>
          <i className={`fa ${this.state.icon}`} />
          {this.props.children}
        </Link>
      </Button>
    );
  }
}

CommunityButton.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

CommunityButton.defaultProps = {
  className: '',
};

export default CommunityButton;
