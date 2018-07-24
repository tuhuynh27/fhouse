import React from 'react';

import { Platform, FlatList, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Card, CardItem, Text, Icon, Picker, View, Form, Item, Button } from 'native-base';

import Slider from "react-native-slider";
import Spacer from './Spacer';

import { toCurrency, toTitleCase } from '../../common/util';

import moment from 'moment';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: Object.keys(props.recipes),
      value: 0.25,
      squareValue: 0.1,
      districtSelect: 'all'
    };
  }

  componentDidMount() {
    this.filterRoom();
  }

  filterRoom() {
    const { recipes } = this.props;
    let keys = Object.keys(recipes);
    const tenmil = 10000000;

    // Filter district
    if (this.state.districtSelect !== 'all') {
      keys = keys.filter((key) => {
        return recipes[key].district.trim().toLowerCase() == this.state.districtSelect;
      });
    }

    // Filter isApprove & price
    keys = keys.filter((key) => {
      return recipes[key].isApproved == 1 && (recipes[key].price < this.state.value * tenmil);
    });

    // Filter square
    keys = keys.filter((key) => {
      return (recipes[key].square > this.state.squareValue * 100);
    });

    this.setState({
      keys
    });

    Actions.refresh({
      title: 'RESULT: ' + keys.length + ' ROOM(S)'
    });
  }

  onDistrictChange(value) {
    this.setState({
      districtSelect: value
    });
  }

  componentWillUpdate() {
    const tenmil = 10000000;
    if (this.state.value * tenmil % 1000000 === 0) {
      this.filterRoom();
    }
  }

  render() {

    // Init var
    const keyExtractor = item => item;
    const onPress = item => Actions.recipe({ match: { params: { id: item.toString() } } });
    const { keys } = this.state;
    const { recipes } = this.props;

    return (
      <Container>
        <Content padder>
          <Slider
            value={this.state.value}
            onValueChange={value => this.setState({ value })}
            animateTransitions={true}
          />

          <Text>
            Price range max to <Text style={{ fontWeight: 'bold' }}>{toCurrency(this.state.value * 10000000)}</Text>VND
            </Text>

          <Slider
            value={this.state.squareValue}
            onValueChange={value => this.setState({ squareValue: value })}
            animateTransitions={true}
          />

          <Text>
            {this.state.squareValue * 100 <= 10 && "No square minimum, scroll the bar to set."}
            {this.state.squareValue * 100 > 10 && <Text>Square minimum at <Text style={{ fontWeight: 'bold' }}>{Math.round(this.state.squareValue * 100)}</Text>m2</Text>}

          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Search rooms at </Text>
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

          <View style={{ marginTop: 10, marginBottom: 10, alignSelf: 'center' }}>
            <Button rounded onPress={() => this.filterRoom()}>
              <Icon name="search" />
              <Text>Search for Room</Text>
            </Button>
          </View>

          {keys.length === 0 && <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fhouse-app.appspot.com/o/NoRoom.png?alt=media&token=4b6ab009-ce5f-46b6-b6d1-7b054534e47e' }} style={{ display: 'flex', height: 350 }}></Image>}

          <FlatList
            numColumns={1}
            data={keys}
            horizontal={false}
            renderItem={({ item }) => (
              <Card transparent style={{ paddingHorizontal: 0, paddingVertical: 5, borderRadius: 0 }}>
                <CardItem>
                  <Text style={{ fontWeight: '800', fontSize: 22 }}>{toTitleCase(recipes[item].address || "")}</Text>
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  recipes: state.recipes.recipes || {}
});

const mapDispatchToProps = {
  //
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);