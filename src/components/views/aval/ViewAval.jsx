import React, { useEffect } from 'react'

import { useLocation } from 'react-router';
import Page from '../Page';
import { Flex } from './styled';

import { useSelector, useDispatch } from 'react-redux';
import { selectAvalById } from 'redux/reducers/avalesSlice';
import { fetchUsers } from 'redux/reducers/usersSlice';

import AvalActions from 'components/aval/sections/AvalActions';
import GeneralSection from 'components/aval/sections/GeneralSection';
import SignaturesSection from 'components/aval/sections/SignaturesSection';
import CuotasSection from 'components/aval/sections/CuotasSection';
import ReclamosSection from 'components/aval/sections/ReclamosSection';
import StatusTag from 'components/aval/StatusTag';
import { demoReclamos } from "./demoData";


const ViewAval = ({ }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const avalId = location.pathname?.split("/").slice(-1)[0];
  const aval = useSelector(state => selectAvalById(state, avalId));

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);


  if (aval && location.search.includes("demo")) {
    aval.reclamos = demoReclamos;
  }


  if (!aval) { //TODO: add skeleton
    return <Page />;
  }



  return (
    <Page>
      <Flex row justify="flex-end" style={{ marginRight: "10px" }}>
        <StatusTag aval={aval} />
      </Flex>
      <AvalActions aval={aval} />
      <GeneralSection aval={aval} />
      <SignaturesSection aval={aval} />
      <CuotasSection aval={aval} />
      <ReclamosSection aval={aval} />

    </Page>
  )
}

export default ViewAval;