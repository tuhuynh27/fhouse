import React from 'react';
import PropTypes from 'prop-types';
import { Image, Linking, ScrollView, Dimensions } from 'react-native';

import { Container, Content, H3, List, ListItem, Text, Button, Tab, Tabs, Textarea, Form, Card, CardItem, Icon, Left, Body, View, CheckBox } from 'native-base';
import ErrorMessages from '../../constants/errors';
import Error from './Error';
import Spacer from './Spacer';

import { toCurrency, toTitleCase, normalizeStr } from '../../common/util';
import { getUserDataByID } from '../../actions/member';

const { width } = Dimensions.get('window');

class RecipeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomMaster: 'None'
    };
  }

  componentDidMount() {
    // Set Room Master name - get from data
    getUserDataByID(this.props.recipes[this.props.recipeId].userID, (roomMaster) => {
      this.setState({
        roomMaster: roomMaster.lastName && roomMaster.lastName ? roomMaster.firstName + ' ' + roomMaster.lastName : 'Guest'
      });
    });
  }

  handleMakeCall(phoneNumber) {
    Linking.openURL(`tel:${phoneNumber}`);
  }

  handleMakeSMS(phoneNumber) {
    Linking.openURL(`sms:${phoneNumber}`);
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
        <CheckBox checked={true} color="blue" />
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
      <Container>
        <Content padder>

          <Card style={{ elevation: 3 }}>
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
                  <Text style={{ fontWeight: 'bold' }}>Location</Text>: {toTitleCase(recipe.district)} Distrcit, {recipe.city || "HCMC"}
                </Text>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Accommodation</Text>: {recipe.roomates} people
                </Text>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Gender</Text>: For {normalizeStr(recipe.gender)}
                </Text>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Room Square</Text>: {recipe.square} m2
                </Text>
                <Spacer size={20} />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Button info style={{ width: '45%', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleMakeCall(recipe.phoneNumber)}>
                    <Icon name='call' />
                    <Text>Call</Text>
                  </Button>
                  <Button warning style={{ width: '45%', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleMakeSMS(recipe.phoneNumber)}>
                    <Icon name='text' />
                    <Text>SMS</Text>
                  </Button>
                </View>
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

export default RecipeView;
