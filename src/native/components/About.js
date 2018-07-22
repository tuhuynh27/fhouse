import React from 'react';
import { Container, Content, Button, Icon, Text } from 'native-base';
import { ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Device height
import { Dimensions } from "react-native";

const deviceHeight = Dimensions.get("window").height;

const About = () => (
  <Container>
    <Content bounces={false}>
      <ImageBackground
        source={require("../../images/about.jpg")}
        style={{ width: '100%', height: deviceHeight }}
      >
        <Button success
          style={{ position: 'absolute', bottom: deviceHeight / 10, left: 40 }}
          onPress={Actions.recipes}
        >
          <Icon name="arrow-dropright-circle"></Icon>
          <Text>View rooms and add to favorite</Text>
        </Button>
      </ImageBackground>
    </Content>
  </Container>
);

export default About;
