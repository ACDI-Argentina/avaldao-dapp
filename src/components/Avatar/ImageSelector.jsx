import React, { useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
const SEditButton = styled.div`
  position: absolute;
  top:10px;
  right:10px;
  z-index:10;
  background-color:white;
  padding:0.25em 0.375em;
  border-radius:50%;
  cursor:pointer;
`

const ImageSelector = ({ onImageSelected }) => {
  const inputRef = useRef();
  return (
    <>
      <SEditButton 
        title="Subir una nueva foto"
        onClick={() => { inputRef.current.click() }}>
        <FontAwesomeIcon fixedWidth={true} icon={faCamera} />
      </SEditButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        multiple={false}
        style={{ display: "none" }}
        onChange={(ev) => {
          const files = inputRef.current.files;
          typeof onImageSelected === "function" && onImageSelected(URL.createObjectURL(files[0]))
        }}
      />
    </>
  )
}

export default ImageSelector;