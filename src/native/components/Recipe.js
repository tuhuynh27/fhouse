import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity } from 'react-native';

import { Container, Content, H3, List, ListItem, Text, Button, Tab, Tabs, Textarea, Form, Card, CardItem, Icon, Left, Body, View } from 'native-base';
import ErrorMessages from '../../constants/errors';
import Error from './Error';
import Spacer from './Spacer';

class RecipeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageStep: 0
    };
  }

  handleChangeImage(length) {
    let imageStep = this.state.imageStep;

    if (imageStep === length - 1) {
      imageStep = 0;
    } else {
      imageStep = imageStep + 1;
    }

    this.setState({
      imageStep: imageStep
    });
  }

  render() {

    // Props
    const { error, recipes, recipeId } = this.props;

    // Error
    if (error) return <Error content={error} />;

    // Get this Recipe from all recipes
    let recipe = null;
    if (recipeId && recipes) {
      recipe = recipes.find(item => parseInt(item.id, 10) === parseInt(recipeId, 10));
    }

    // Recipe not found
    if (!recipe) return <Error content={ErrorMessages.recipe404} />;

    // Build Ingredients listing
    // const ingredients = recipe.ingredients.map(item => (
    //   <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
    //     <Text>{item}</Text>
    //   </ListItem>
    // ));

    // Build Method listing
    // const method = recipe.method.map((item, index) => (
    //   <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
    //     <Text><Text style={{ fontWeight: 'bold' }}>{index + 1} ... </Text> {item}</Text>
    //   </ListItem>
    // ));

    return (
      <Container>
        <Content padder>

          <Card style={{ elevation: 3 }}>
            <CardItem>
              <H3>{recipe.address}</H3>
            </CardItem>
            <CardItem cardBody>
              <TouchableOpacity onPress={() => this.handleChangeImage(recipe.images.length)} style={{ flex: 1 }}>
                <Image style={{ height: 200, width: null, flex: 1 }} source={{ uri: recipe.images[this.state.imageStep] }} />
              </TouchableOpacity>
            </CardItem>
            <CardItem>
              <Icon name="pricetag" style={{ color: '#000' }} />
              <Text>{recipe.price} VND</Text>
              <Spacer size={25} />
              <Icon name="person" style={{ color: '#000' }} />
              <Text>Tu Huynh</Text>
            </CardItem>
          </Card>

          <Tabs>
            <Tab heading="Specs">
              {/* <Text style={{ padding: 20 }}>{recipe.body}</Text> */}
              <View style={{ padding: 20 }}>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Location</Text>: {recipe.district}, {recipe.city}
                </Text>
              </View>
            </Tab>
            <Tab heading="Utilities">
              {/* <List>
                {method}
              </List> */}
              <Text>List Utilities</Text>
            </Tab>
            <Tab heading="Description">
              <Content>
                {/* <List>
                  {ingredients}
                </List> */}
                <Text>Description details</Text>
              </Content>
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
  recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

RecipeView.defaultProps = {
  error: null,
};

export default RecipeView;
