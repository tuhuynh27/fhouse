import React from 'react';
import { Container, Content } from 'native-base';
import { Image, StyleSheet } from 'react-native';
import Spacer from './Spacer';

const About = () => (
  <Container>
    <Content>
      <Image
        source={{ uri: 'https://uphinhnhanh.com/images/2018/07/12/ScreenShot2018-07-12at14.17.28.png' }}
        style={styles.canvas}
      />
    </Content>
  </Container>
);

const styles = StyleSheet.create({
  canvas: {
    height: 800,
    width: null,
    borderWidth: 0,
    flex: 1,
  },
});

export default About;
