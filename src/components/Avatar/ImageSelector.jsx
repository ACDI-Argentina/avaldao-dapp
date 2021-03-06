import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { SEditButton } from './styled';
import { useTranslation } from 'react-i18next';

const ImageSelector = ({ onImageSelected }) => {
  const inputRef = useRef();
  const { t } = useTranslation();
  return (
    <>
      <SEditButton 
        title={t('userAvatarChoose')}
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