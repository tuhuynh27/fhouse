import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, RefreshControl, Image, Platform } from 'react-native';
import { Container, Content, Card, CardItem, Text, Icon, Picker, View, Form, Item } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import Spacer from './Spacer';

import { toCurrency, toTitleCase, toUnsignedString, getLocationObj } from '../../common/util';

import { Location, Permissions } from 'expo';
import axios from 'axios';
import moment from 'moment';
class RecipeListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: Object.keys(props.recipes).reverse(),
      address: '',
      districtSelect: 'all'
    };
  }

  componentWillMount() {
    this.getLocationAsync();
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('Permission denied!')
    }

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

    if (location) {
      const lat = location.coords.latitude;
      const long = location.coords.longitude;
      const apiKey = 'AIzaSyAl4Jxq4xNB48094_Oqm7w_kBHnAkstnAg';

      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=false&key=${apiKey}`)
        .then(res => {
          const locationObj = getLocationObj(toUnsignedString(res.data.results[0].formatted_address));

          this.setState({
            address: locationObj,
            districtSelect: locationObj.district.replace(/Quan /g, "").trim().toLowerCase() || 'all'
          });

          this.districtFilter(locationObj.district.replace(/Quan /g, "").trim().toLowerCase() || 'all');

          console.log('Ahihi: ', locationObj.district.replace(/Quan /g, "").trim().toLowerCase());
        });
    }
  };

  onDistrictChange(value) {
    this.districtFilter(value);

    this.setState({
      districtSelect: value
    });
  }

  districtFilter(value) {
    const { recipes } = this.props;
    let keys = Object.keys(this.props.recipes).reverse();

    if (value !== 'all') {
      keys = keys.filter((key) => {
        return recipes[key].district.trim().toLowerCase() == value;
      });
    }

    this.setState({
      keys
    });
  }

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

    const { keys } = this.state;

    return (
      <Container>
        <Content padder>
          <Spacer size={20} />

          <Text>You are at <Text style={{ fontWeight: 'bold' }}>{(this.state.address.street) || "Somewhere"}, {(this.state.address.ward) || "Loading..."} Ward</Text></Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Show rooms at </Text>
            <Form>
              <Item picker>
                <Picker
                  mode="dropdown"
                  placeholder="Select district"
                  style={{ width: (Platform.OS === 'ios') ? undefined : 200 }}
                  iosHeader="Select district"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  headerBackButtonTextStyle={{ color: 'red' }}
                  headerStyle={{ backgroundColor: "#b95dd3" }}
                  headerBackButtonTextStyle={{ color: "#fff" }}
                  headerTitleStyle={{ color: "#fff" }}
                  selectedValue={this.state.districtSelect}
                  onValueChange={(v) => this.onDistrictChange(v)}
                >
                  <Picker.Item label="All District" value="all" />
                  <Picker.Item label="Binh Thanh District" value="binh thanh" />
                  <Picker.Item label="Binh Tan District" value="binh tan" />
                  <Picker.Item label="Phu Nhuan District" value="phu nhuan" />
                  <Picker.Item label="Tan Binh District" value="tan binh" />
                  <Picker.Item label="Tan Phu District" value="tan phu" />
                  <Picker.Item label="Thu Duc District" value="thu duc" />
                  <Picker.Item label="1 District" value="1" />
                  <Picker.Item label="2 District" value="2" />
                  <Picker.Item label="3 District" value="3" />
                  <Picker.Item label="4 District" value="4" />
                  <Picker.Item label="5 District" value="5" />
                  <Picker.Item label="6 District" value="6" />
                  <Picker.Item label="7 District" value="7" />
                  <Picker.Item label="8 District" value="8" />
                  <Picker.Item label="9 District" value="9" />
                  <Picker.Item label="10 District" value="10" />
                  <Picker.Item label="11 District" value="11" />
                  <Picker.Item label="12 District" value="12" />
                </Picker>
              </Item>
            </Form>
          </View>

          <Spacer size={10} />

          {keys.length === 0 && <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fhouse-app.appspot.com/o/NoRoom.png?alt=media&token=4b6ab009-ce5f-46b6-b6d1-7b054534e47e' }} style={{ display: 'flex', height: 350 }}></Image>}

          <FlatList
            numColumns={1}
            data={keys}
            horizontal={false}
            renderItem={({ item }) => (
              <Card transparent style={{ paddingHorizontal: 0, paddingVertical: 5, borderRadius: 0 }}>
                <CardItem>
                  <Text style={{ fontWeight: '800', fontSize: 22 }}>{toTitleCase(recipes[item].address)}</Text>
                </CardItem>
                <CardItem>
                  <Icon name="pin" style={{ color: '#000', fontSize: 20 }} />
                  <Text>{toTitleCase(recipes[item].district)} District</Text>
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
