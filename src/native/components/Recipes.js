import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Container, Content, Card, CardItem, Text, Icon, H2 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import Spacer from './Spacer';

import { toCurrency, toTitleCase } from '../../common/util';

const RecipeListing = ({
  error,
  loading,
  recipes,
  reFetch,
}) => {
  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  const keyExtractor = item => item.id;

  const onPress = item => Actions.recipe({ match: { params: { id: String(item.id) } } });

  return (
    <Container>
      <Content padder>
        <Spacer size={20} />

        <H2 style={{ textAlign: 'center' }}>Suggested Room</H2>

        <Spacer size={10} />

        <FlatList
          numColumns={2}
          data={recipes}
          horizontal={false}
          renderItem={({ item }) => (
            <Card transparent style={{ paddingHorizontal: 4 }}>
              <CardItem>
                <Text style={{ height: 40, fontWeight: '800' }}>{toTitleCase(item.address)}</Text>
              </CardItem>
              <CardItem>
                <Icon name="pin" style={{ color: '#000' }} />
                <Text>{item.district}</Text>
              </CardItem>
              <CardItem cardBody>
                <TouchableOpacity onPress={() => onPress(item)} style={{ flex: 1 }}>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={{
                      height: 100,
                      width: null,
                      flex: 1,
                      borderRadius: 0,
                      marginTop: 10,
                    }}
                  />
                </TouchableOpacity>
              </CardItem>

              <CardItem>
                <Icon name="pricetag" style={{ color: '#000' }} />
                <Text>{toCurrency(item.price)}</Text>
              </CardItem>
            </Card>
          )}
          keyExtractor={keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={reFetch}
            />
          }
        />

        <Spacer size={20} />
      </Content>
    </Container>
  );
};

RecipeListing.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  reFetch: PropTypes.func,
};

RecipeListing.defaultProps = {
  error: null,
  reFetch: null,
};

export default RecipeListing;
