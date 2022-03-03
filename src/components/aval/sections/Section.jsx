import React from 'react'
import styled from 'styled-components';
const Wrapper = styled.div`
  background: #FFFFFF;
  padding: 20px;
`


const Section = ({children, ...props}) => {
  return (
    <Wrapper {...props}>
      {children}
    </Wrapper>
  )
}
export default Section;

