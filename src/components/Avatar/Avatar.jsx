import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import ImageSelector from './ImageSelector';
import getCroppedImg from './cropImage';
import { useEffect } from 'react';
import { Absolute } from './styled';
import { IconButton } from './buttons';
import { faCheck, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';


const AvatarWrapper = styled.div`
  position:relative;
  height:100%;
  width:75%;
  box-sizing:border-box;
  display:flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0px;

`
const AvatarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0px;
`

const AvatarImage = styled.img`
  border-radius: 50%;
  width: 325px;
  height: 325px;
`
const ImageWrapper = styled.div`

`
const ImageContainer = styled.div`
  position:relative;
  width: 325px;
  height: 325px;
`


const Avatar = ({ imageSrc, onCropped }) => {
  const [editing, setEditing] = useState(false);
  const [image, setImage] = useState(imageSrc);
  const [croppedImage, setCroppedImage] = useState(imageSrc); /* Cropped image as base64 */
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setImage(imageSrc);
  }, [imageSrc])

  
  useEffect(() => {
    /* Reset zoom and crop when image changes */
      setZoom(1);
      setCrop({ x: 0, y: 0 });
  }, [image])

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(
      image,
      croppedAreaPixels,
    );
    setCroppedImage(croppedImage);
    typeof onCropped === "function" && onCropped(croppedImage);
  }


  return (
    <AvatarWrapper>
      {editing ? (
        <AvatarContainer>
          <ImageSelector onImageSelected={setImage} />
          <Absolute top="55px" right="10px">
            <IconButton
              icon={faCheck}
              title="Ok"
              onClick={() => {
                setImage(croppedImage);
                setEditing(false);
              }}
            />
          </Absolute>
          <Absolute top="100px" right="10px">
            <IconButton
              icon={faTimes}
              title="Cancelar"
              onClick={() => setEditing(false)}
            />
          </Absolute>
          <Cropper
            zoomSpeed={0.1}
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: { backgroundColor: "#656565" }
            }}
          />
        </AvatarContainer>
      ) : (
        <ImageWrapper>
          <ImageContainer>
            <AvatarImage src={image} />
            <Absolute right="8%" bottom="8%">
              <IconButton
                style={{
                  container:{
                    backgroundColor:"#737373",
                    boxShadow: "1px 1px 10px 1px #737373"
                  },
                  icon:{
                    color:"#EEEEEE"
                  }
                }}
                icon={faPencilAlt}
                title="Editar"
                onClick={() => setEditing(true)}
              />
            </Absolute>
          </ImageContainer>

        </ImageWrapper>
      )}
    </AvatarWrapper>

  )
}

export default Avatar;