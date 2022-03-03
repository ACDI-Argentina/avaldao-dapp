import React, { useEffect } from 'react'
import Page from './Page';
import { Flex } from './styled';
import { useSelector, useDispatch } from 'react-redux';
import { selectAvalById } from 'redux/reducers/avalesSlice';
import { fetchUsers } from 'redux/reducers/usersSlice';
import AvalActions from 'components/aval/sections/AvalActions';
import AvalGeneralSection from 'components/aval/sections/AvalGeneralSection';
import SignaturesSection from 'components/aval/sections/SignaturesSection';
import CuotasSection from 'components/aval/sections/CuotasSection';
import ReclamosSection from 'components/aval/sections/ReclamosSection';
import StatusIndicator from 'components/StatusIndicator';
import Alert from '@material-ui/lab/Alert';
import { Grid, makeStyles } from '@material-ui/core';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme) => ({
  alert: {
    width: '100%',
    marginTop: theme.spacing(2)
  }
}));

const AvalView = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const avalId = props.match.params.avalId;
  const aval = useSelector(state => selectAvalById(state, avalId));
  const currentUser = useSelector(state => selectCurrentUser(state));
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  if (!aval) { //TODO: add skeleton
    return <Page />;
  }

  const taskCode = aval.getTaskCode(currentUser);

  return (
    <Page>
      <Grid direction="column" container spacing={3} style={{ padding: "2em" }}>
        <Flex row justify="flex-end" style={{ marginRight: "10px" }}>
          <StatusIndicator status={aval.status} />
        </Flex>
        {taskCode && (
          <div className={classes.alert}>
            <Alert severity="info">{t(taskCode)}</Alert>
          </div>
        )}
        
        <AvalGeneralSection aval={aval} />
        <SignaturesSection aval={aval} />
        <CuotasSection aval={aval} />
        <ReclamosSection aval={aval} />

        <Flex row justify="flex-end" style={{ marginRight: "10px" }}>
          <AvalActions aval={aval} />
        </Flex>
      </Grid>
    </Page>
  )
}

export default AvalView;