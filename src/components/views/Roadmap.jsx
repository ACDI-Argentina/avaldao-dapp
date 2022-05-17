import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import RoomIcon from '@material-ui/icons/Room';
import CheckBoxSharpIcon from '@material-ui/icons/CheckBoxSharp';
import CheckBoxOutlineBlankSharpIcon from '@material-ui/icons/CheckBoxOutlineBlankSharp';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));


export default function Roadmap() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Typography variant="h5">{t('roadmapTitle')}</Typography>
      <Stepper orientation="vertical">
        <Step expanded={true} completed={true}>
          <StepLabel icon={
            <CheckBoxSharpIcon />
          }>
            <Typography variant="h6">{t('roadmapStep1Title')}</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="overline">{t('roadmapStep1Subtitle')}</Typography>
            <Typography variant="body2">{t('roadmapStep1Description')}</Typography>
          </StepContent>
        </Step>
        <Step expanded={true} active={true}>
          <StepLabel icon={
            <RoomIcon />
          }>
            <Typography variant="h6">{t('roadmapStep2Title')}</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="overline">{t('roadmapStep2Subtitle')}</Typography>
            <Typography variant="body2">{t('roadmapStep2Description')}</Typography>
          </StepContent>
        </Step>
        <Step expanded={true}>
          <StepLabel icon={
            <CheckBoxOutlineBlankSharpIcon />
          }>
            <Typography variant="h6">{t('roadmapStep3Title')}</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="overline">{t('roadmapStep3Subtitle')}</Typography>
            <Typography variant="body2">{t('roadmapStep3Description')}</Typography>
          </StepContent>
        </Step>
        <Step expanded={true}>
          <StepLabel icon={
            <CheckBoxOutlineBlankSharpIcon />
          }>
            <Typography variant="h6">{t('roadmapStep4Title')}</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="overline">{t('roadmapStep4Subtitle')}</Typography>
            <Typography variant="body2">{t('roadmapStep4Description')}</Typography>
          </StepContent>
        </Step>
        <Step expanded={true}>
          <StepLabel icon={
            <CheckBoxOutlineBlankSharpIcon />
          }>
            <Typography variant="h6">{t('roadmapStep5Title')}</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="overline">{t('roadmapStep5Subtitle')}</Typography>
            <Typography variant="body2">{t('roadmapStep5Description')}</Typography>
          </StepContent>
        </Step>
        <Step expanded={true}>
          <StepLabel icon={
            <CheckBoxOutlineBlankSharpIcon />
          }>
            <Typography variant="h6">{t('roadmapStep6Title')}</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="overline">{t('roadmapStep6Subtitle')}</Typography>
            <Typography variant="body2">{t('roadmapStep6Description')}</Typography>
          </StepContent>
        </Step>
      </Stepper>
    </React.Fragment>
  );
}