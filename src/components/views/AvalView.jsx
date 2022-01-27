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

const AvalView = (props) => {
  const dispatch = useDispatch();
  const avalId = props.match.params.avalId;
  const aval = useSelector(state => selectAvalById(state, avalId));

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  if (!aval) { //TODO: add skeleton
    return <Page />;
  }

  return (
    <Page>
      <Flex row justify="flex-end" style={{ marginRight: "10px" }}>
        <StatusIndicator status={aval.status} />
      </Flex>
      <AvalGeneralSection aval={aval} />
      <SignaturesSection aval={aval} />
      <CuotasSection aval={aval} />
      <ReclamosSection aval={aval} />
      <Flex row justify="flex-end" style={{ marginRight: "10px" }}>
        <AvalActions aval={aval} />
      </Flex>
    </Page>
  )
}

export default AvalView;