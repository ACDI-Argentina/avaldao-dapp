import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { registerCurrentUser } from '../redux/reducers/currentUserSlice';

import { Box, Grid } from '@material-ui/core';
import { Form, Input } from 'formsy-react-components';
import FormsyImageUploader from './FormsyImageUploader';
import LoaderButton from './LoaderButton';
import GridItem from './Grid/GridItem';
import { User } from 'models';


const ProfileForm = ({
  user,
  showSubmit = true,
  showCompact = false,
  onFinishEdition,
}) => {

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [url, setUrl] = useState(user.url);
  const [avatar, setAvatar] = useState(user.avatar);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSaving && user.isRegistered) {
      setIsSaving(false);

      if (onFinishEdition && typeof onFinishEdition === 'function') {
        onFinishEdition();
      }
    }
  }, [isSaving, user]);

  const saveDisabled = isSaving || isPristine || !canSubmit || (user && user.giverId === 0);

  const columnWidth = showCompact ? 6 : 12;

  const onSubmit = async (model) => {
    setIsSaving(true);
    const userInstance = new User({
      address: user.address,
      registered: user.registered,
      name: name,
      email: email,
      url: url,
      avatar: avatar      
    });

    if (!userInstance.address) {
      setIsSaving(false); //TODO: Agregar algun mensaje de error indicando que no esta autenticado
    } else {
      dispatch(registerCurrentUser(userInstance));
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      onValid={() => setCanSubmit(true)}
      onInvalid={() => setCanSubmit(false)}
      onChange={(currentValues, isChanged) => setIsPristine(!isChanged)}
      layout="vertical"
    >
      <Box style={{ marginLeft: -15, marginRight: -15 }}>
        <Grid container direction="row">
          <GridItem xs={12} sm={12} md={columnWidth}>
            <div className="form-group">
              <Input
                name="name"
                autoComplete="name"
                id="name-input"
                label="Your name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="John Doe."
                validations="minLength:3"
                validationErrors={{ minLength: 'Please enter your name' }}
                required={true}
                autoFocus
              />
            </div>
          </GridItem>

          <GridItem xs={12} sm={12} md={columnWidth}>
            <div className="form-group">
              <Input
                name="email"
                autoComplete="email"
                label="Email"
                value={email}
                placeholder="email@example.com"
                validations="isEmail"
                help="Please enter your email address."
                required={true}
                validationErrors={{ isEmail: "Oops, that's not a valid email address." }}
              />
            </div>
          </GridItem>
        </Grid>
      </Box>

      <FormsyImageUploader
        name="avatar"
        setImage={setAvatar}
        avatar={avatar}
        aspectRatio={1}
        isRequired={true}
      />

      <div className="form-group">
        <Input
          name="url"
          label="Your Profile"
          type="text"
          value={url}
          placeholder="Your profile url"
          help="Provide a link to some more info about you, this will help to build trust. You could add your linkedin profile, Twitter account or a relevant website."
          required={true}
          validations="isUrl"
          validationErrors={{
            isUrl: 'Please enter a valid url',
          }}
        />
      </div>

      {showSubmit && (
        <div className="form-group">
          <Box my={2} display="flex" justifyContent="flex-end">
            <Box>
              <LoaderButton
                color="primary"
                className="btn btn-info"
                formNoValidate
                type="submit"
                disabled={saveDisabled}
                isLoading={isSaving}
                loadingText="Saving..."
              >
                Save profile
              </LoaderButton>
            </Box>
          </Box>
        </div>
      )}
    </Form>
  );
};

export default ProfileForm;