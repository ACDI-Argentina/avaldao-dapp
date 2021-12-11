import styled from 'styled-components';

export const StatusPosition = styled.div`
  position: absolute;
  top:25px;
  right:25px;
`;

export const H2 = styled.h2`
  text-align:center;
  margin:30px 0px;
`

export const Flex = styled.div`
  display: flex;
  ${props => props.justify && `justify-content:${props.justify};`}
 
`