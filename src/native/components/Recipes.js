import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Container, Content, Card, CardItem, Text, Icon, H2, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import Spacer from './Spacer';

import { toCurrency, toTitleCase, toUnsignedString, getLocationObj } from '../../common/util';

import { Constants, Location, Permissions } from 'expo';
import axios from 'axios';
class RecipeListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      address: ''
    };
  }

  componentWillMount() {
    this.getLocationAsync();
  }

  componentWillUpdate() {
    const { location } = this.state;
    if (this.state.location) {
      const lat = location.coords.latitude;
      const long = location.coords.longitude;
      const apiKey = 'AIzaSyAl4Jxq4xNB48094_Oqm7w_kBHnAkstnAg';

      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=false&key=${apiKey}`)
        .then(res => {
          const locationObj = getLocationObj(toUnsignedString(res.data.results[0].formatted_address));
          this.setState({
            address: locationObj
          });
        })
    }
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('Permission denied!')
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  render() {
    // Props
    const {
      error,
      loading,
      recipes,
      reFetch,
    } = this.props;

    // Loading
    if (loading) return <Loading />;

    // Error
    if (error) return <Error content={error} />;

    const keyExtractor = item => item;

    const onPress = item => Actions.recipe({ match: { params: { id: item.toString() } } });

    const keys = Object.keys(recipes);

    return (
      <Container>
        <Content padder>
          <Spacer size={20} />

          <H2 style={{ textAlign: 'center' }}>Suggested Room</H2>

          <Spacer size={20} />

          <Button block rounded primary onPress={Actions.addRoom}>
            <Icon name="add"></Icon>
            <Text>Add New Room</Text>
          </Button>

          <Spacer size={20} />

          <Text style={{ fontWeight: 'bold' }}>Your district is: {(this.state.address.district) || "Loading..."}</Text>
          <Text style={{ fontWeight: 'bold' }}>Your ward is: {(this.state.address.ward) || "Loading..."}</Text>

          <Spacer size={10} />

          <FlatList
            numColumns={2}
            data={keys}
            horizontal={false}
            renderItem={({ item }) => (
              <Card transparent style={{ paddingHorizontal: 4 }}>
                <CardItem>
                  <Text style={{ height: 40, fontWeight: '800' }}>{toTitleCase(recipes[item].address)}</Text>
                </CardItem>
                <CardItem>
                  <Icon name="pin" style={{ color: '#000' }} />
                  <Text>{toTitleCase(recipes[item].district)} D.</Text>
                </CardItem>
                <CardItem cardBody>
                  <TouchableOpacity onPress={() => onPress(item)} style={{ flex: 1 }}>
                    <Image
                      source={{ uri: recipes[item].images[0] }}
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
                  <Text>{toCurrency(recipes[item].price)}</Text>
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
  }
}

RecipeListing.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  recipes: PropTypes.object.isRequired,
  reFetch: PropTypes.func,
};

RecipeListing.defaultProps = {
  error: null,
  reFetch: null,
};

export default RecipeListing;
