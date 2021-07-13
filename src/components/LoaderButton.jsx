import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@material-ui/core';
import Button from "components/CustomButtons/Button.js";


// Need to disable the button type because the rule does not allow prop values
/* eslint react/button-has-type: 0 */
/**
 * Renders a button with an optional loader
 *
 *  @param className      ClassNames
 *  @param formNoValidate Wether to validate formsy
 *  @param disable        Disables button
 *  @param isLoading      State of button. If true, disables and renders spinner
 *  @param loadingText    Text to show when state is loading
 *  @param children       Elements / text showing when state is not loading
 */
const LoaderButton = ({
  color,
  className,
  formNoValidate,
  type,
  disabled,
  isLoading,
  loadingText,
  children,
}) => (
  <span>
    <Button color={color} className={className} formNoValidate={formNoValidate} type={type} disabled={disabled}>
      {isLoading && (
        <span>
          {loadingText}
          <CircularProgress size={10} />
        </span>
      )}
      {!isLoading && <span>{children}</span>}
    </Button>
  </span>
);

LoaderButton.propTypes = {
  className: PropTypes.string,
  formNoValidate: PropTypes.bool,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.string,
};

LoaderButton.defaultProps = {
  className: '',
  formNoValidate: false,
  disabled: false,
  isLoading: true,
  loadingText: '',
  children: null,
  type: 'button',
};

export default LoaderButton;
