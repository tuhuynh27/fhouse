import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground, FlatList, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Card, CardItem, List, ListItem, Body, Left, Text, Icon, Button } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { toCurrency, toTitleCase } from '../../common/util';
import Spacer from './Spacer';

import moment from 'moment';

// Device height
import { Dimensions } from "react-native";

const deviceHeight = Dimensions.get("window").height;

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    // Props
    const { member, logout } = this.props;

    const keyExtractor = item => item;
    const onPress = item => Actions.recipe({ match: { params: { id: item.toString() } } });
    const { recipes } = this.props;

    let keys = Object.keys(recipes).reverse();
    keys = keys.filter((key) => {
      return recipes[key].userID === member.uid;
    });

    return (
      <Container>
        <Content bounces={false}>
          <List>
            {(member && member.email) ?
              <View style={{ marginTop: 30 }}>
                <Content padder scrollEnabled={false} style={{ marginLeft: 50 }}>
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

                <Content padder>
                  <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10, marginBottom: 10, alignSelf: 'center', padding: 10, backgroundColor: '#3F51B5', color: 'white' }}>My posted rooms</Text>

                  {keys.length === 0 && <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fhouse-app.appspot.com/o/MyRoomNo.png?alt=media&token=55f90691-2a00-4fdf-977b-65ae5ac009dc' }} style={{ display: 'flex', height: 350 }}></Image>}

                  <FlatList
                    numColumns={1}
                    data={keys}
                    horizontal={false}
                    renderItem={({ item }) => (
                      <Card transparent style={{ paddingHorizontal: 0, paddingVertical: 5, borderRadius: 0 }}>
                        <CardItem>
                          <Text style={{ fontWeight: '800', fontSize: 22 }}>
                            {toTitleCase(recipes[item].address || "")} {recipes[item].isApproved === 0 && "(Pending)"} {recipes[item].isApproved === 2 && "(Rejected)"} {recipes[item].status === true && "(Hidden)"}
                          </Text>
                        </CardItem>
                        <CardItem>
                          <Icon name="pin" style={{ color: '#000', fontSize: 20 }} />
                          <Text>{toTitleCase(recipes[item].district || "")} District</Text>
                          <Spacer size={25} />
                          <Icon name="cube" style={{ color: '#000', fontSize: 20 }} />
                          <Text>{recipes[item].square} m2</Text>
                        </CardItem>
                        <CardItem cardBody>
                          <TouchableOpacity onPress={() => onPress(item)} style={{ flex: 1 }}>
                            <Image
                              source={{ uri: recipes[item].images[0] }}
                              style={{
                                height: 200,
                                width: null,
                                flex: 1,
                                borderRadius: 0,
                                marginTop: 10,
                              }}
                            />
                          </TouchableOpacity>
                        </CardItem>

                        <CardItem>
                          <Icon name="logo-usd" style={{ color: '#000', fontSize: 20 }} />
                          <Text>{toCurrency(recipes[item].price)}</Text>
                          <Spacer size={25} />
                          <Icon name="time" style={{ color: '#000', fontSize: 20 }} />
                          <Text>{moment().add(moment().unix() - recipes[item].time, 'seconds').fromNow()}</Text>
                        </CardItem>
                      </Card>
                    )}
                    keyExtractor={keyExtractor}
                  />
                </Content>
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
  }
}

Profile.propTypes = {
  member: PropTypes.shape({}),
  logout: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  member: {},
};

const mapStateToProps = state => ({
  recipes: state.recipes.recipes || {}
});

const mapDispatchToProps = {
  //
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
