import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, H3 } from 'native-base';
import Spacer from './Spacer';

const Error = ({ title, content }) => (
  <Container>
    <Content padder>
      <H3>{title}</H3>
      <Spacer size={10}/>
      <Text>{content}</Text>
    </Content>
  </Container>
);

Error.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

Error.defaultProps = {
  title: 'Uh oh',
  content: 'An unexpected error came up',
};

export default Error;
