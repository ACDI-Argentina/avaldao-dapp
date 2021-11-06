import styled from 'styled-components';

const Box = styled.div`
  box-sizing:border-box;
    
  width:100%;
  ${props => props.xs && `
      width: ${(props.xs / 12) * 100}%;  
  `}
  ${props => props.sm && `
  @media (min-width: 576px) {
    /* border: 1px solid steelblue; */
    width: ${(props.sm / 12) * 100}%;  
  }
  `}
  ${props => props.md && `
    @media (min-width: 768px) {
      /* border: 1px solid tomato; */
      width: ${(props.md / 12) * 100}%;  
    }
  `}
  ${props => props.lg && `
    @media (min-width: 992px) {
      /* border: 1px solid palegreen; */
      width: ${(props.lg / 12) * 100}%;  
    }
  `}
  ${props => props.xl && `
    @media (min-width: 1200px) {
      /* border: 1px solid palevioletred; */
      width: ${(props.xl / 12) * 100}%;  
    }
  `}
  ${props => props.xxl && `
  @media (min-width: 1400px) {
    /* border: 1px solid #FFD700; */
    width: ${(props.xxl / 12) * 100}%;  
  }
`}
  
`;

export default Box;