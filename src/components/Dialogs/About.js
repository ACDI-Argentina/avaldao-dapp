import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Logo from 'assets/img/logos/avaldao.svg';
import CloseIcon from '@material-ui/icons/Close';
import packageJson from '../../../package.json';
import CommitIcon from 'assets/img/icons/git-commit.svg';

import {
  Content,
  Row,
  ImageWrapper,
  ImageContainer,
  Div,
  ResponsiveImg,
  SCommitIcon,
  CloseContainer,
} from './about/styled';


const {
  REACT_APP_BUILD_TS,
  REACT_APP_BUILD_COMMIT,
} = process.env;

const About = ({ onClose, ...props }) => {
  const { version } = packageJson;
  const repoUrl = 'https://github.com/ACDI-Argentina/avaldao-dapp';

  // A esto vamos a tenerlo que leerlo desde version.html o algun otro archivo que genermos por aca, o bien que sea version.txt

  const commitHash = REACT_APP_BUILD_COMMIT;
  const commitUrl = REACT_APP_BUILD_COMMIT ? `https://github.com/ACDI-Argentina/avaldao-dapp/commit/${commitHash}` : null;

  return (
    <Dialog onClose={onClose} {...props}>
      <Content>
        <CloseContainer onClick={() => onClose()}>
          <CloseIcon />
        </CloseContainer>
        <ImageWrapper>
          <ImageContainer>
            <ResponsiveImg src={Logo} />
          </ImageContainer>
        </ImageWrapper>
        <Row>
          <Div>Version: {version}</Div>
          <Div>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              <i className="fab fa-github" />
              View on github
            </a>
          </Div>
          {commitUrl && (
            <Div>
              <a
                href={commitUrl}
                target="_blank"
                rel="noreferrer"
                title={`Build date: ${REACT_APP_BUILD_TS}`}
              >
                <SCommitIcon src={CommitIcon} /> {commitHash.substring(0,7)}
              </a>
            </Div>
          )}
        </Row>
      </Content>
    </Dialog>
  );
};

export default About;
