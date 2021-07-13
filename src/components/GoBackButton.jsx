import React from 'react';
import PropTypes from 'prop-types';
import { goBackOnePath, history } from '../lib/helpers';
import { Button } from '@material-ui/core';
import { NavigateBefore } from '@material-ui/icons';

const GoBackButton = ({ styleName, title, to }) => (
  <div
    onClick={() => (to ? history.push(to) : goBackOnePath())}
    onKeyPress={() => (to ? history.push(to) : goBackOnePath())}
    role="button"
    tabIndex="0"
    className={`go-back-button ${styleName}`}
  >
    <Button size="small">
      <NavigateBefore/> {title}
    </Button>
  </div>
);

export default GoBackButton;

GoBackButton.propTypes = {
  to: PropTypes.string,
  styleName: PropTypes.string,
  title: PropTypes.string,
};

GoBackButton.defaultProps = {
  to: undefined,
  styleName: '',
  title: 'back',
};
