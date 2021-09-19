import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import ImageSelector from './ImageSelector';
import getCroppedImg from './cropImage';
import { useEffect } from 'react';


const CropWrapper = styled.div`
  position:relative;
  height:100%;
  width:75%;
  box-sizing:border-box;
  
`
const CropContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0px;
`

const Avatar = ({ imageSrc, onCropped }) => {
  const [image, setImage] = useState(imageSrc);
  const [croppedImage, setCroppedImage] = useState(imageSrc); /* Cropped image as base64 */
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setImage(imageSrc);
  },[imageSrc])

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(
      image,
      croppedAreaPixels,
    );
    setCroppedImage(croppedImage);
  }

  useEffect(() => {
    typeof onCropped === "function" && onCropped(croppedImage);
  },[croppedImage])

  return (
    <CropWrapper>
      <CropContainer>
        <ImageSelector onImageSelected={setImage} />
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
      </CropContainer>
    </CropWrapper>

  )
}

export default Avatar;