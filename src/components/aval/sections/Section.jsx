import React from 'react'
import styled from 'styled-components';
const Wrapper = styled.div`
  background: #FFFFFF;
  box-shadow: 1.40323px 0px 18.2419px rgba(48, 55, 85, 0.07);

  margin-bottom:15px;
  padding:15px;
  @media (min-width: 768px) {
      padding:25px;
      margin-left:15px;
      margin-right:15px;
    }
`


const Section = ({children, ...props}) => {
  return (
    <Wrapper {...props}>
      {children}
    </Wrapper>
  )
}
export default Section;

