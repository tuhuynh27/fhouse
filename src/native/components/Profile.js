import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground } from 'react-native';
import { Container, Content, List, ListItem, Body, Left, Text, Icon, Card, CardItem, Right, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';

// Device height
import { Dimensions } from "react-native";

const deviceHeight = Dimensions.get("window").height;

const Profile = ({ member, logout }) => (
  <Container>
    <Content bounces={false}>
      <List>
        {(member && member.email) ?
          <View>
            <Content padder scrollEnabled={false} style={{marginLeft: 50}}>
              <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 10 }}>{member.firstName} {member.lastName}</Text>
              <Text style={{ marginBottom: 20 }}>Ho Chi Minh City</Text>
            </Content>

            <ListItem onPress={Actions.updateProfile} icon>
              <Left>
                <Icon name="person-add" />
              </Left>
              <Body>
                <Text>Update My Profile</Text>
              </Body>
            </ListItem>
            <ListItem onPress={logout} icon>
              <Left>
                <Icon name="power" />
              </Left>
              <Body>
                <Text>Logout</Text>
              </Body>
            </ListItem>
          </View>
          :
          <View>
            <ImageBackground
              style={{ width: '100%', height: deviceHeight }}
              source={require("../../images/feature.jpg")}
            >
              <Button primary
                style={{ position: 'absolute', bottom: deviceHeight / 5, left: 20 }}
                onPress={Actions.login}
              >
                <Icon name="logo-facebook"></Icon>
                <Text>Login with Facebook</Text>
              </Button>
            </ImageBackground>
          </View>
        }
      </List>
    </Content>
  </Container>
);

Profile.propTypes = {
  member: PropTypes.shape({}),
  logout: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  member: {},
};

export default Profile;
