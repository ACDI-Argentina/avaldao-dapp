import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import LoadingOverlay from '../Loading/LoadingOverlay';

class PrimaryButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { children, classes, isWorking } = this.props;
    return (
      <LoadingOverlay loading={isWorking}>
        <Button {...this.props}
          color="primary"
          className={classes.root}
          variant="contained">
          {children}
        </Button>
      </LoadingOverlay>
    );
  }
}

const styles = theme => ({
  root: {
    borderRadius: "1.5em",
    margin: "0.5em 0.5em 0.5em 0.5em"
  }
});

PrimaryButton.defaultProps = {
  isWorking: false
}

export default withStyles(styles)(PrimaryButton);