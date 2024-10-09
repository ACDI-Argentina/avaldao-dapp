import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Page from './Page';
import { Grid, Typography } from '@material-ui/core';
import styles from 'assets/jss/material-kit-react/views/componentsSections/aboutViewStyle.js';

const useStyles = makeStyles(styles);

/**
 * Pantalla de FAQ 
 * 
 */
const FaqPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
    
  return (
    <Page>
      <Grid container spacing={1} style={{ padding: '2em' }}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h5" className={classes.title}>
            {t('faqTitle')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className={classes.subtitle}>
            {t('faqQuestion1')}
          </Typography>
          <Typography variant="body1" className={classes.body}>
            {t('faqResponse1')}
          </Typography>
        </Grid>
      </Grid>
    </Page>
  );
};

export default FaqPage;
