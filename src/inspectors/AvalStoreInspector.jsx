import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { selectAllAvales } from 'redux/reducers/avalesSlice';
import styled from 'styled-components';
const Wrapper = styled.div`
  border:2px solid steelblue;
  position: absolute;
  top:0px;
  left:0px;
  padding:10px;
  background-color:white;
  z-index:100000;
  min-width:250px;
  border-radius:12px 0px;
  max-height:100vh;
  overflow: auto;

`
const Aval = styled.div`
  margin: 15px 0px;
  border:1px solid gray;

`


const AvalStoreInspector = ({ }) => {
  const avales = useSelector(selectAllAvales);
  const history = useHistory();

  return (
    <Wrapper>
      <h3>Avales: {avales.length}</h3>
      {avales.map(aval => (
        <Aval key={aval.id}>
          <pre>
            {JSON.stringify(aval, null, 3)}
          </pre>
          <button onClick={() => {
            console.log(`navigate to /aval-completar/${aval.id}`)
            history.push(`/aval-completar/${aval.id}`);
          }}>Completar</button>
        </Aval>
      ))}
    </Wrapper>
  );
}

export default AvalStoreInspector;