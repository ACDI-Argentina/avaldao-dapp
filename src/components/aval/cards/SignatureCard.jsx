import React from 'react'
import styled from 'styled-components';
import { faClone, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { selectUserByAddress } from 'redux/reducers/usersSlice';

const BoxContent = styled.div`
  height:100%;
  box-sizing:border-box;
  display:flex;
  flex-direction:column;
  align-items:center;
  min-height:250px;

  position:relative;
`;

const ProfileLinkPosition = styled.div`
  position:absolute;
  top:-5px;
  right:-5px;
`

const ImagePlaceholder = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  min-width:200px;
  min-height:200px;
`;

const RoundedImg = styled.img`
  border-radius:50%;
  margin:10px;
  max-width:200px;
`

const Rol = styled.span`
  font-weight:600;
  font-size:1.35em;
  color: #BFBFBF;
  text-transform: capitalize;
  margin:5px;
`


const Name = styled.span`
  font-weight:700;
  font-size:1.25em;
  color: #303755;
  text-transform: capitalize;
  margin:5px;
`

const Copy = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;  
  border-radius: 2px;

  color: #888;
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px 0px;
  background: rgba(255, 255, 255, 0.75);
  
  /* display:none; */
  opacity:0;

  outline: 0;
  text-align: center;
  cursor: pointer;
  
  /* padding: 0 13px; */
  
  border-radius: 3px;
  border: 1px solid transparent;
  transition: all .3s ease;
  border-color: #e8e8e8;
  
  font-weight: 600;
  
  line-height: 16px;
  font-size: 11px;
  :hover {
      background: rgba(232, 232, 232, 0.76);
      color: #3d3d3d;
  }
  

`

const Address = styled.div`
  position:relative;
  line-height:30px;
  cursor:default;
  overflow:hidden;
  text-overflow: ellipsis;
  box-sizing:border-box;
  padding: 0px 5px;
  max-width:100%;
  color: #0645AD;
  &:hover {
    ${Copy} {
      
      opacity:100;
    }
  }
`
const Signature = styled.div`
  position:relative;
  color: #10B981;
  line-height:30px;

  max-width:100%;
  box-sizing:border-box;
  overflow:hidden;
  text-overflow: ellipsis;
  /* word-break: break-all; */
  
  cursor:default;

  &:hover {
    ${Copy} {
      
      opacity:100;
    }
  }
`


const Card = styled.div`
  padding:20px;
  border-radius:12px;
  background: #FFFFFF;
  box-shadow: 1.40323px 0px 18.2419px rgba(48, 55, 85, 0.07);
  text-overflow: ellipsis;
  overflow:hidden;
`

const SignatureCard = ({ user }) => { //podemos pasar user & signature
  /* User should be an instance of UserClass    ma va que si*/
  //name, address! //buscar los datos x address
  const uuser = useSelector(state => selectUserByAddress(state, user.address));
  console.log(uuser)

  return (
    <Card>
      <BoxContent>
        <ProfileLinkPosition>
          <FontAwesomeIcon
            title={"Ver detalles"}
            icon={faExternalLinkAlt}
            style={{
              color: "#555555",
              cursor: "pointer",
              fontSize: "20px",
            }}
          />
        </ProfileLinkPosition>
        <ImagePlaceholder>
          <RoundedImg
            title={uuser?.name}
            src={uuser?.avatarCidUrl}
          />
        </ImagePlaceholder>
        <Name>{uuser?.name}</Name>
        {/* <Rol>{user.rol}</Rol> */}
        <Address title={user.address}>
          {user.address}
          <Copy title="copy" onClick={() => {
            navigator.clipboard.writeText(user.address);
            console.log(`Copied to clipboard ${user.address}`)
          }}>
            <FontAwesomeIcon icon={faClone} />
          </Copy>
        </Address>
        <Signature title={user.signature}>
          {user.signature}
          <Copy title="copy" onClick={() => {
            navigator.clipboard.writeText(user.signature);
            console.log(`Copied to clipboard ${user.signature}`)
          }}>
            <FontAwesomeIcon icon={faClone} />
          </Copy>
        </Signature>
      </BoxContent>
    </Card>
  )
}





export default SignatureCard;

