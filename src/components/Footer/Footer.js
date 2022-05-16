import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/footerStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { SocialIcon } from 'react-social-icons';

/**
 * The Footer section
 */
class Footer extends Component {

  render() {
    const { classes, t, } = this.props;

    return (
      <div className={classes.section}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          spacing={0}
        >
          <Grid item xs={8}>
            <img src={require("assets/img/logos/avaldao-alt.svg")} alt={t('give4forest')} className={classes.dappLogo} />
          </Grid>
          <Grid item xs={8} style={{ marginBottom: "1em", textAlign: "right" }}>
            {/*<SocialIcon url="https://www.facebook.com/ACDIargentina%20/"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />*/}
            {/*<SocialIcon url="https://www.instagram.com/acdiargentina/"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />*/}
            {/*<SocialIcon url="https://twitter.com/ACDIargentina"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />*/}
            {/*<SocialIcon url="https://www.linkedin.com/company/acdiargentina"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />*/}
            <SocialIcon url="https://twitter.com"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />
            <SocialIcon url="https://www.linkedin.com"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />
            <SocialIcon url="https://telegram.org"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />
          </Grid>
          <Grid item xs={8}>
            <h6 className={classes.disclaimer}>
              {t('disclaimer')}
            </h6>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Footer.propTypes = {};

export default withTranslation()((withStyles(styles)(Footer)))
