import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    /*color: "#000",
    backgroundColor: "#7868E5"*/
  },
  tap: {

  },
  logoGrid: {
    textAlign: "center"
  },
  logo: {
    height: '2.5em',
    textAlign: "center"
  },
}));

export default function Sponsors() {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Paper className={classes.root}>

      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="full width tabs example"
        centered
      >
        <Tab label={t('sponsorTap1Title')} {...a11yProps(0)} className={classes.tap} />
        <Tab label={t('sponsorTap2Title')} {...a11yProps(1)} className={classes.tap} />
        <Tab label={t('sponsorTap3Title')} {...a11yProps(2)} className={classes.tap} />
      </Tabs>

      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container
            spacing={3}
            justifyContent="space-evenly"
            alignItems="center">
            <Grid item xs={12} sm={6} md={3} className={classes.logoGrid}>
              <a href="https://www.acdi.org.ar" target="_blank">
                <img src={require("assets/img/logos/acdi.png")} alt={t('sponsorAcdi')} className={classes.logo} />
              </a>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.logoGrid}>
              <a href="https://elfuturoestaenelmonte.org" target="_blank">
                <img src={require("assets/img/logos/el-futuro-esta-en-el-monte.png")} alt={t('sponsorElFuturoEstaEnElMonte')} className={classes.logo} />
              </a>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.logoGrid}>
              <a href="https://bidlab.org" target="_blank">
                <img src={require("assets/img/logos/IDB-Lab.gif")} alt={t('sponsorBidlab')} className={classes.logo} />
              </a>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.logoGrid}>
              <a href="https://www.rsk.co/" target="_blank">
                <img src={require("assets/img/logos/rsk.svg")} alt={t('sponsorRsk')} className={classes.logo} />
              </a>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container
            spacing={3}
            justifyContent="space-evenly"
            alignItems="center">
            <Grid item xs={12} sm={6} md={3} className={classes.logoGrid}>
              <a href="https://bidlab.org" target="_blank">
                <img src={require("assets/img/logos/IDB-Lab.gif")} alt={t('sponsorBidlab')} className={classes.logo} />
              </a>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.logoGrid}>
              <a href="https://www.iovlabs.org/" target="_blank">
                <img src={require("assets/img/logos/iovlabs.jpg")} alt={t('sponsorIovlabs')} className={classes.logo} />
              </a>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Grid container
            spacing={3}
            justifyContent="space-evenly"
            alignItems="center">
            <Grid item xs={12} sm={6} md={3} className={classes.logoGrid}>
              <a href="https://metamask.io" target="_blank">
                <img src={require("assets/img/logos/metamask.svg")} alt={t('sponsorMetamask')} className={classes.logo} />
              </a>
            </Grid>
          </Grid>
        </TabPanel>
      </SwipeableViews>
    </Paper>
  );
}