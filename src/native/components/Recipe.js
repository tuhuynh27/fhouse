import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import { Container, Content, H3, List, ListItem, Text, Button, Tab, Tabs, Textarea, Form, Card, CardItem, Icon, Left, Body } from 'native-base';
import ErrorMessages from '../../constants/errors';
import Error from './Error';
import Spacer from './Spacer';

const RecipeView = ({
  error,
  recipes,
  recipeId,
}) => {
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
  const ingredients = recipe.ingredients.map(item => (
    <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
      <Text>{item}</Text>
    </ListItem>
  ));

  // Build Method listing
  const method = recipe.method.map((item, index) => (
    <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
      <Text><Text style={{ fontWeight: 'bold' }}>{index + 1} ... </Text> {item}</Text>
    </ListItem>
  ));

  return (
    <Container>
      <Content padder>
      
        <Card style={{ elevation: 3 }}>
          <CardItem>
            <H3>{recipe.title}</H3>
          </CardItem>
          <CardItem cardBody>
            <Image style={{ height: 200, width: null, flex: 1 }} source={{ uri: recipe.image }} />
          </CardItem>
          <CardItem>
            <Icon name="heart" style={{ color: '#f93943' }} />
            <Text>69</Text>
            <Spacer size={25} />
            <Icon name="person" style={{ color: '#000' }} />
            <Text>{recipe.author}</Text>
          </CardItem>
        </Card>

        <Tabs>
          <Tab heading="About">
            <Text style={{ padding: 20 }}>{recipe.body}</Text>
          </Tab>
          <Tab heading="Guide">
            <List>
              {method}
            </List>
          </Tab>
          <Tab heading="Material">
            <Content>
              <List>
                {ingredients}
              </List>
            </Content>
          </Tab>
          <Tab heading="Comments">
            <Content padder>
              <Text style={{ padding: 10 }}>
                No comment here, be the first!
              </Text>
              <Form>
                <Textarea rowSpan={5} bordered placeholder="Leave your comment here..." style={{ padding: 10 }} />
              </Form>
              <Button block success>
                <Text>Add Comment</Text>
              </Button>
            </Content>
          </Tab>
        </Tabs>
        <Spacer size={20} />
      </Content>
    </Container>
  );
};

RecipeView.propTypes = {
  error: PropTypes.string,
  recipeId: PropTypes.string.isRequired,
  recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

RecipeView.defaultProps = {
  error: null,
};

export default RecipeView;
