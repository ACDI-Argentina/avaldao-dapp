import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import WarningIcon from '@material-ui/icons/Warning';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles'

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    const { classes } = this.props;
    if (this.state.errorInfo) {
      return (
        <React.Fragment>
          <Container maxWidth="sm">
            <Card className={classes.root}>
              <CardHeader
                avatar={
                  <Avatar className={classes.avatar}>
                    <WarningIcon />
                  </Avatar>
                }
                title="An error has been ocurred"
                subheader={
                  this.state.error &&
                  <Typography variant="caption" color="error">
                    {this.state.error.message}
                  </Typography>
                }
              />
              <CardContent>
                {this.state.error &&
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Error message
                    </Typography>
                    <Typography variant="caption" color="error">
                      {this.state.error.message}
                    </Typography>
                  </Grid>
                }
                {this.state.errorInfo.componentStack &&
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Component
                    </Typography>
                    <Typography variant="caption" color="error">
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  </Grid>}
                {this.state.error &&
                  <React.Fragment >
                    {this.state.error.fileName &&
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Error file name
                        </Typography>
                        <Typography variant="caption" color="error">
                          {this.state.error.fileName}
                        </Typography>
                      </Grid>}
                    {this.state.error.lineNumber &&
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Error line number
                        </Typography>
                        <Typography variant="caption" color="error">
                          {this.state.error.lineNumber}
                        </Typography>
                      </Grid>}
                    {this.state.error.stack &&
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Error stack
                        </Typography>
                        <Typography variant="caption" color="error">
                          {this.state.error.stack}
                        </Typography>
                      </Grid>}
                  </React.Fragment >
                }
              </CardContent>
            </Card>
          </Container>
        </React.Fragment >
      );
    } else {
      // Normally, just render children
      return this.props.children;
    }
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: '2em'
  },
  avatar: {
    backgroundColor: theme.palette.error.main
  }
});

export default withStyles(styles)(ErrorBoundary);