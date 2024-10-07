import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerCurrentUser, selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { User } from '@acdi/efem-dapp';
import { history } from '@acdi/efem-dapp';
import validatorUtils from 'lib/blockchain/ValidatorUtils';
import Avatar from '../Avatar/Avatar';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import InputAdornment from '@material-ui/core/InputAdornment';
import Page from 'components/pages/Page';
import Background from 'components/views/Background';
import { InputField } from '@acdi/efem-dapp';
import Paper from '@material-ui/core/Paper';
import SecondaryButton from 'components/buttons/SecondaryButton';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { ipfsService } from 'commons';
import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@material-ui/core';

const UserProfilePage = ({  }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { address, avatarCid, name: userName, email: userEmail, url: userUrl, status } = currentUser;

  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [url, setUrl] = useState(userUrl);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarImg, setAvatarImg] = useState(ipfsService.resolveUrl(avatarCid));

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  const [emailHelperText, setEmailHelperText] = useState('');
  const [urlHelperText, setUrlHelperText] = useState('');
  const [formValid, setFormValid] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser?.address) {
      const { name, email, url } = currentUser;
      setName(name || '');
      setEmail(email || '');
      setUrl(url || '');
      setAvatarImg(ipfsService.resolveUrl(currentUser?.avatarCid));
    }
  }, [currentUser]);

  const handleChangeName = (event) => {
    const newName = event.target.value;
    setName(newName);
    if (!newName) {
      setNameHelperText(t('errorRequired'));
      setNameError(true);
    } else {
      setNameHelperText('');
      setNameError(false);
    }
    validateForm();
  };

  const handleChangeEmail = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (!newEmail || !validatorUtils.isValidEmail(newEmail)) {
      setEmailHelperText(t('errorInvalidEmail'));
      setEmailError(true);
    } else {
      setEmailHelperText('');
      setEmailError(false);
    }
    validateForm();
  };

  const handleChangeUrl = (event) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
    if (!newUrl || !validatorUtils.isValidUrl(newUrl)) {
      setUrlHelperText(t('errorInvalidUrl'));
      setUrlError(true);
    } else {
      setUrlHelperText('');
      setUrlError(false);
    }
    validateForm();
  };

  const validateForm = () => {
    const isFormValid = name && email && url && !nameError && !emailError && !urlError;
    setFormValid(isFormValid);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = new User(currentUser);
    user.address = address;
    user.name = name;
    user.email = email;
    user.url = url;
    user.avatar = avatarPreview;
    dispatch(registerCurrentUser(user));
  };

  const cancel = () => {
    history.push(`/`);
  };


  const isSaving = currentUser?.status?.name === "Registering" ?? false;
  return (
    <Page>
      <Background>
        <Paper>
          <Grid container spacing={1} style={{ padding: '2em' }}>
            <Grid item xs={12}>
              <Typography variant="h5">{t('userProfileTitle')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <Grid container spacing={1} style={{ margin: '0px' }}>
                  <Grid item xs={12} md={5}>
                    <Avatar
                      imageSrc={avatarImg}
                      onCropped={(cropped) => {
                        setAvatarPreview(cropped);
                        validateForm();
                      }}
                      labels={{ choose: t('userAvatarChoose') }}
                    />
                  </Grid>

                  <Grid container item spacing={1} xs={12} md={7}>
                    <Grid item xs={12}>
                      <InputField
                        id="addressTextField"
                        value={address}
                        label={t('userAddress')}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        disabled
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountBalanceWalletIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputField
                        id="nameTextField"
                        value={name}
                        onChange={handleChangeName}
                        label={t('userName')}
                        helperText={nameHelperText}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={nameError}
                        required
                        inputProps={{ maxLength: 50 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputField
                        id="emailTextField"
                        value={email}
                        onChange={handleChangeEmail}
                        label={t('userEmail')}
                        helperText={emailHelperText}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={emailError}
                        required
                        inputProps={{ maxLength: 50 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputField
                        id="urlTextField"
                        value={url}
                        onChange={handleChangeUrl}
                        label={t('userUrl')}
                        helperText={urlHelperText}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={urlError}
                        required
                        inputProps={{ maxLength: 50 }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} justifyContent="flex-end">
                    <SecondaryButton onClick={cancel}>
                      {t('cancel')}
                    </SecondaryButton>

                    <PrimaryButton type="submit" disabled={!formValid || isSaving} isWorking={isSaving}>
                      {t('save')}
                    </PrimaryButton>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Background>
    </Page>
  );
};

export default UserProfilePage;
