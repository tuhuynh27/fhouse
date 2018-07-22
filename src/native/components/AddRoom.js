import React from 'react';
import { Container, Content, Text, H3, Form, Item, Label, Input, Picker, Icon, Button, List, ListItem, CheckBox, Body, Toast, Textarea } from 'native-base';
import { View, Image, ActivityIndicator } from 'react-native';
import Error from './Error';
import Spacer from './Spacer';
import { ImagePicker } from 'expo';
import { Actions } from 'react-native-router-flux';

import { normalizeStr, toUnsignedString, getLocationObj } from '../../common/util';
import { validatePhone, validateNumber, greaterThanZero } from '../../common/validate';

import { uploadImage } from '../../actions/file';
import { addRoom } from '../../actions/recipes';

import { connect } from 'react-redux';

import { Location, Permissions } from 'expo';
import axios from 'axios';

class AddRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      districtSelect: 'binh thanh',
      genderSelect: 'any',
      images: [],
      listUtilities: [
        "parking place",
        "room toilet"
      ],
      listEquipments: [
        "kitchen",
        "bed"
      ],
      utility: '',
      equipment: '',
      address: '',
      square: null,
      price: null,
      phoneNumber: null,
      numOfRoomates: null,
      description: '',
      isUploading: false
    };
  }

  componentDidMount() {
    // If not member
    if (!this.props.member.email) {
      Actions.pop();
      Actions.login();
    }
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
            address: locationObj.street + ', ' + locationObj.ward,
            districtSelect: locationObj.district.replace(/Quan /g, "").toLowerCase() || 'all'
          });
        });
    }
  };

  onDistrictChange(value) {
    this.setState({
      districtSelect: value
    });
  }

  onGenderChange(value) {
    this.setState({
      genderSelect: value
    });
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  handlePickImage = async () => {
    // Get permission for iOS devices
    let permission = await this.handleGetPermission();

    if (permission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        // Set images size
        allowsEditing: true,
        aspect: [16, 9],
      });

      if (!result.cancelled) {
        this.setState({
          isUploading: true
        });

        const imageUrl = await uploadImage(result.uri);
        let images = this.state.images;
        await images.push(imageUrl);

        this.setState({
          images,
          isUploading: false
        });
      } else {
        Toast.show({
          text: 'Image select cancelled!',
          duration: 5000,
          style: {
            backgroundColor: "red"
          },
          position: "top"
        });
      }
    } else {
      Toast.show({
        text: 'Please accept camera permission to continue!',
        duration: 5000,
        style: {
          backgroundColor: "red"
        },
        position: "top"
      });
    }
  };

  handleGetPermission = async () => {
    const { Location, Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      return true;
    } else {
      // throw new Error('Location permission not granted');
      return false;
    }
  }

  handleRemoveFromList(option, item) {
    let list = this.state[option];
    const index = list.indexOf(item);

    if (index !== -1) {
      list.splice(index, 1);
    }

    this.setState({
      [option]: list
    });
  }

  handleAddToList(option, field) {
    const value = this.state[field]
    let list = this.state[option];

    if (value && value.trim()) {
      list.push(value);
      this.setState({
        [option]: list,
        [field]: null
      });
    }
  }

  handlePostRoom() {
    const {
      districtSelect,
      genderSelect,
      images,
      address,
      square,
      price,
      phoneNumber,
      numOfRoomates
    } = this.state;
    let valid = false;

    if (districtSelect
      && genderSelect
      // && images && images.length === 0 
      && address.trim()
      && square && validateNumber(square) && greaterThanZero(square)
      && price && validateNumber(price) && greaterThanZero(price)
      && phoneNumber && validatePhone(phoneNumber)
      && numOfRoomates && validateNumber(numOfRoomates) && greaterThanZero(numOfRoomates)
    ) {
      valid = true;
    }

    Toast.show({
      text: `Room posted ${valid ? "success and waiting for admin approval" : "fail, please review your form!"} `,
      duration: 3000,
      style: {
        backgroundColor: valid ? "green" : "red"
      },
      position: "top"
    });

    if (valid) {
      addRoom({
        address: this.state.address,
        square: this.state.square,
        price: this.state.price,
        phoneNumber: this.state.phoneNumber,
        roomates: this.state.numOfRoomates,
        district: this.state.districtSelect,
        gender: this.state.genderSelect,
        images: this.state.images,
        utilities: this.state.listUtilities,
        equipment: this.state.listEquipments,
        description: this.state.description,
        userID: this.props.member.uid
      });
      Actions.recipes();
    }
  }

  render() {
    const renderImages = this.state.images.map(item => (
      <Image key={item} source={{ uri: item }} style={{ height: 200, width: null, flex: 1, marginBottom: 10 }} />
    ));

    const renderListUtilities = this.state.listUtilities.map(item => (
      <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
        <CheckBox checked={true} color="violet" onPress={() => this.handleRemoveFromList('listUtilities', item)} />
        <Body><Text>{normalizeStr(item)}</Text></Body>
      </ListItem>
    ));

    const renderListEquipments = this.state.listEquipments.map(item => (
      <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
        <CheckBox checked={true} color="green" onPress={() => this.handleRemoveFromList('listEquipments', item)} />
        <Body><Text>{normalizeStr(item)}</Text></Body>
      </ListItem>
    ));

    return (
      <Container>
        <Content padder>
          <Spacer size={10} />
          <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>General Information</Text>
          <Spacer size={10} />
          <Form>
            <Item stackedLabel>
              <Label>Address</Label>
              <Input value={this.state.address} onChangeText={val => this.handleChange('address', val)} />
            </Item>
            <Item picker>
              <Picker
                mode="dropdown"
                placeholder="Select district"
                iosHeader="Select district"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                headerBackButtonTextStyle={{ color: 'red' }}
                headerStyle={{ backgroundColor: "#b95dd3" }}
                headerBackButtonTextStyle={{ color: "#fff" }}
                headerTitleStyle={{ color: "#fff" }}
                selectedValue={this.state.districtSelect}
                onValueChange={(v) => this.onDistrictChange(v)}
              >
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
            <Item stackedLabel>
              <Label>Square (in M2)</Label>
              <Input keyboardType="numeric"
                value={this.state.addresss}
                onChangeText={val => this.handleChange('square', val)} />
            </Item>
            <Item stackedLabel>
              <Label>Price (in VND)</Label>
              <Input keyboardType="numeric"
                value={this.state.price}
                onChangeText={val => this.handleChange('price', val)} />
            </Item>
            <Item stackedLabel>
              <Label>Phone Number</Label>
              <Input keyboardType="numeric"
                value={this.state.phone}
                onChangeText={val => this.handleChange('phoneNumber', val)} />
            </Item>
            <Item stackedLabel>
              <Label>Number of Roomate Allow</Label>
              <Input keyboardType="numeric"
                value={this.state.numOfRoomates}
                onChangeText={val => this.handleChange('numOfRoomates', val)} />
            </Item>
            <Item picker>
              <Picker
                mode="dropdown"
                placeholder="Select gender"
                iosHeader="Select gender"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                headerBackButtonTextStyle={{ color: 'red' }}
                headerStyle={{ backgroundColor: "#b95dd3" }}
                headerBackButtonTextStyle={{ color: "#fff" }}
                headerTitleStyle={{ color: "#fff" }}
                selectedValue={this.state.genderSelect}
                onValueChange={(v) => this.onGenderChange(v)}
              >
                <Picker.Item label="Any gender" value="any" />
                <Picker.Item label="Male Only" value="male" />
                <Picker.Item label="Female Only" value="female" />
              </Picker>
            </Item>

            <Spacer size={10} />
            <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>Room Images ({this.state.images.length})</Text>
            <Spacer size={20} />

            <Button block rounded success onPress={() => this.handlePickImage()}>
              <Text>Choose Image from Photos</Text>
            </Button>
            <View style={{ padding: 10 }}>
              {this.state.images.length ? renderImages : null}
              {this.state.isUploading && <ActivityIndicator size="large" color="blue" style={{ padding: 10 }} />}
            </View>

            <Spacer size={10} />
            <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>Room Utilities ({this.state.listUtilities.length})</Text>
            <Spacer size={10} />
            <List>
              {renderListUtilities}
            </List>
            <Item inlineLabel>
              <Label>New utility</Label>
              <Input value={this.state.utility} onChangeText={v => this.handleChange('utility', v)} />
            </Item>
            <Button block rounded info onPress={() => this.handleAddToList('listUtilities', 'utility')}>
              <Icon name="add"></Icon>
              <Text>Add</Text>
            </Button>

            <Spacer size={10} />
            <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>Room Equipments ({this.state.listEquipments.length})</Text>
            <Spacer size={10} />
            <List>
              {renderListEquipments}
            </List>
            <Item inlineLabel>
              <Label>New equipment</Label>
              <Input value={this.state.equipment} onChangeText={v => this.handleChange('equipment', v)} />
            </Item>
            <Button block rounded info onPress={() => this.handleAddToList('listEquipments', 'equipment')}>
              <Icon name="add"></Icon>
              <Text>Add</Text>
            </Button>

            <Spacer size={10} />
            <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>Add Description</Text>
            <Spacer size={10} />
            <Textarea rowSpan={5} bordered placeholder="Some more thing about this room..." onChangeText={v => this.handleChange('description', v)} />
          </Form>
          <Spacer size={10} />
          <Button block primary onPress={() => this.handlePostRoom()}>
            <Icon name="add"></Icon>
            <Text>Post this room!!</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  //
};

export default connect(mapStateToProps, mapDispatchToProps)(AddRoom);