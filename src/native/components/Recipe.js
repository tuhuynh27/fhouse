import React from 'react';
import PropTypes from 'prop-types';
import { Image, Linking, ScrollView, Dimensions } from 'react-native';

import { Container, Content, H3, List, ListItem, Text, Button, Tab, Tabs, Textarea, Form, Card, CardItem, Icon, Left, Body, View, CheckBox, Toast } from 'native-base';
import ErrorMessages from '../../constants/errors';
import Error from './Error';
import Spacer from './Spacer';

import { toCurrency, toTitleCase, normalizeStr } from '../../common/util';
import { getUserDataByID, addFavoriteRoom } from '../../actions/member';
import { hideRoom, unhideRoom } from "../../actions/recipes";

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

const { width } = Dimensions.get('window');
class RecipeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomMaster: 'Guest',
      location: ''
    };
  }

  componentDidMount() {
    // Set Room Master name - get from data
    getUserDataByID(this.props.recipes[this.props.recipeId].userID, (roomMaster) => {
      this.setState({
        roomMaster: roomMaster.lastName && roomMaster.lastName ? roomMaster.firstName + ' ' + roomMaster.lastName : 'Guest'
      });
    });

    if (this.props.recipes[this.props.recipeId].userID === this.props.member.uid) {
      Actions.refresh({
        title: 'My Posted Room',
      });
    } else {
      Actions.refresh({
        title: 'Room in ' + toTitleCase(this.props.recipes[this.props.recipeId].district) + ' District',
        right: (<Button transparent onPress={() => this.addToFavorite(this.props.recipeId)}><Icon name="heart" style={{ color: '#4656b0' }} /></Button>)
      });
    }
  }

  addToFavorite(id) {
    if (!this.props.member.email) {
      Toast.show({
        text: 'Please login to use add to favorite!',
        duration: 2000,
        style: {
          backgroundColor: "red"
        },
        position: "top"
      });
      return;
    }

    addFavoriteRoom(id, (result) => {
      if (result.isAdd) {
        Toast.show({
          text: 'Removed from favorite room!',
          duration: 1000,
          style: {
            backgroundColor: "orange"
          },
          position: "top"
        });
        Actions.pop();
      } else {
        Toast.show({
          text: 'Added to favorite room!',
          duration: 1000,
          style: {
            backgroundColor: "violet"
          },
          position: "top"
        });
        Actions.pop();
        Actions.favorite();
      }
    });
  }

  handleMakeCall(phoneNumber) {
    Linking.openURL(`tel:${phoneNumber}`);
  }

  handleMakeSMS(phoneNumber) {
    Linking.openURL(`sms:${phoneNumber}`);
  }

  handleHideRoom(id) {
    hideRoom(id);

    Toast.show({
      text: 'Success hide the room!',
      duration: 1000,
      style: {
        backgroundColor: "orange"
      },
      position: "top"
    });
    Actions.pop();
  }

  handleUnhideRoom(id) {
    unhideRoom(id);

    Toast.show({
      text: 'Success un-hide the room!',
      duration: 1000,
      style: {
        backgroundColor: "violet"
      },
      position: "top"
    });
    Actions.pop();
  }

  render() {
    // Props
    const { error, recipes, recipeId } = this.props;

    // Error
    if (error) return <Error content={error} />;

    // Get this Recipe from all recipes
    const recipe = recipes[recipeId];

    // Recipe not found
    if (!recipe) return <Error content={ErrorMessages.recipe404} />;

    // Render images
    const renderImages = recipe.images.map(image => (
      <View style={{
        width: width - 80,
        margin: 10,
        height: 200,
        borderRadius: 5,
      }} key={image}>
        <Image style={{ flex: 1 }} source={{ uri: image }} />
      </View>
    ))

    // Build listing
    const utilities = recipe.utilities.map(item => (
      <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
        <CheckBox checked={true} color="violet" />
        <Body><Text>{normalizeStr(item)}</Text></Body>
      </ListItem>
    ));

    const equipment = recipe.equipment.map(item => (
      <ListItem key={normalizeStr(item)} rightIcon={{ style: { opacity: 0 } }}>
        <CheckBox checked={true} color="green" />
        <Body><Text>{normalizeStr(item)}</Text></Body>
      </ListItem>
    ));

    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Content>
          <Card transparent style={{ elevation: 3 }}>
            <CardItem>
              <H3>{toTitleCase(recipe.address)}</H3>
            </CardItem>
            <CardItem cardBody>
              <ScrollView
                ref={(scrollView) => { this.scrollView = scrollView; }}
                horizontal={true}
                decelerationRate={0}
                snapToInterval={width - 60}
                snapToAlignment={"center"}
                contentInset={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                }}>
                {renderImages}
              </ScrollView>
            </CardItem>
            <CardItem>
              <Icon name="pricetag" style={{ color: '#000' }} />
              <Text>{toCurrency(recipe.price)}</Text>
              <Spacer size={25} />
              <Icon name="person" style={{ color: '#000' }} />
              <Text>{this.state.roomMaster}</Text>
            </CardItem>
          </Card>

          <Tabs>
            <Tab heading="Quick View">
              <View style={{ padding: 20 }}>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Location</Text>: {toTitleCase(recipe.district)} District, {recipe.city || "HCMC"}
                </Text>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Current roomates</Text>: {recipe.roomates} people
                </Text>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Gender</Text>: For {normalizeStr(recipe.gender)}
                </Text>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Room Square</Text>: {recipe.square} m2
                </Text>
                <Spacer size={20} />
                {recipe.userID === this.props.member.uid && recipe.status !== true && <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <Button success onPress={() => this.handleHideRoom(this.props.recipeId)}>
                    <Icon name="checkbox" />
                    <Text>Hide this room</Text>
                  </Button>
                </View>}
                {recipe.userID === this.props.member.uid && recipe.status === true && <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <Button light onPress={() => this.handleUnhideRoom(this.props.recipeId)}>
                    <Icon name="cloud-upload" />
                    <Text>Unhide This Room</Text>
                  </Button>
                </View>}
                {recipe.userID !== this.props.member.uid && <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Button info style={{ width: '45%', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleMakeCall(recipe.phoneNumber)}>
                    <Icon name='call' />
                    <Text>Call</Text>
                  </Button>
                  <Button warning style={{ width: '45%', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleMakeSMS(recipe.phoneNumber)}>
                    <Icon name='text' />
                    <Text>SMS</Text>
                  </Button>
                </View>}
              </View>
            </Tab>
            <Tab heading="Utilities">
              <Text style={{ padding: 10, fontWeight: 'bold', textAlign: 'center' }}>This room has</Text>
              <List>
                {utilities}
              </List>
              <Text style={{ padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Room equipments</Text>
              <List>
                {equipment}
              </List>
            </Tab>
            <Tab heading="Description">
              <View style={{ padding: 20 }}>
                <Text>{recipe.description || "No description"}</Text>
              </View>
            </Tab>
          </Tabs>
          <Spacer size={20} />
        </Content>
      </Container>
    );
  };
}

RecipeView.propTypes = {
  error: PropTypes.string,
  recipeId: PropTypes.string.isRequired,
  recipes: PropTypes.object.isRequired,
};

RecipeView.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  //
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeView);