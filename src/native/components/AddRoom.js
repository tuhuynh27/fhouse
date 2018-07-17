import React from 'react';
import { Container, Content, Text, H3, Form, Item, Label, Input, Picker, Icon, Button, List, ListItem, CheckBox, Body, Toast } from 'native-base';
import { View, Image } from 'react-native';
import Spacer from './Spacer';
import { ImagePicker } from 'expo';
import { Actions } from 'react-native-router-flux';

import { normalizeStr } from '../../common/util';
import { validatePhone, validateNumber, greaterThanZero } from '../../common/validate';

import { uploadImage } from "../../actions/file"
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
            phone: null,
            numOfRoomates: null
        };
    }

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
                const imageUrl = await uploadImage(result.uri);
                let images = this.state.images;
                images.push(imageUrl);
                this.setState({ images });
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
            phone,
            numOfRoomates
        } = this.state;
        let valid = false;

        if (districtSelect
            && genderSelect
            // && images && images.length === 0 
            && address.trim()
            && square && validateNumber(square) && greaterThanZero(square)
            && price && validateNumber(price) && greaterThanZero(price)
            && phone && validatePhone(phone)
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
            Actions.recipes();
        }
    }

    render() {
        const renderImages = this.state.images.map(item => (
            <Image key={item} source={{ uri: item }} style={{ height: 200, width: null, flex: 1 }} />
        ));

        const renderListUtilities = this.state.listUtilities.map(item => (
            <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
                <CheckBox checked={true} color="blue" onPress={() => this.handleRemoveFromList('listUtilities', item)} />
                <Body><Text>{normalizeStr(item)}</Text></Body>
            </ListItem>
        ));

        const renderListEquipments = this.state.listEquipments.map(item => (
            <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
                <CheckBox checked={true} color="blue" onPress={() => this.handleRemoveFromList('listEquipments', item)} />
                <Body><Text>{normalizeStr(item)}</Text></Body>
            </ListItem>
        ));

        return (
            <Container>
                <Content padder>
                    <Spacer size={10} />
                    <H3 style={{ textAlign: 'center' }}>Add Room</H3>
                    <Spacer size={10} />

                    <Spacer size={10} />
                    <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>General Information</Text>
                    <Spacer size={10} />
                    <Form>
                        <Item inlineLabel>
                            <Label>Address</Label>
                            <Input value={this.state.address} onChangeText={val => this.handleChange('address', val)} />
                        </Item>
                        <Picker
                            mode="dropdown"
                            iosHeader="Select district"
                            iosIcon={<Icon name="pin" />}
                            style={{ width: undefined }}
                            selectedValue={this.state.districtSelect}
                            onValueChange={(v) => this.onDistrictChange(v)}
                        >
                            <Picker.Item label="Binh Thanh District" value="binh thanh" />
                            <Picker.Item label="Phu Nhuan District" value="phu nhuan" />
                            <Picker.Item label="Tan Binh District" value="tan binh" />
                            <Picker.Item label="Tan Phu District" value="tan phu" />
                            <Picker.Item label="Thu Duc District" value="thu duc" />
                        </Picker>
                        <Item inlineLabel>
                            <Label>Square (in M2)</Label>
                            <Input keyboardType="numeric"
                                value={this.state.addresss}
                                onChangeText={val => this.handleChange('square', val)} />
                        </Item>
                        <Item inlineLabel>
                            <Label>Price (in VND)</Label>
                            <Input keyboardType="numeric"
                                value={this.state.price}
                                onChangeText={val => this.handleChange('price', val)} />
                        </Item>
                        <Item inlineLabel>
                            <Label>Phone Number</Label>
                            <Input keyboardType="numeric"
                                value={this.state.phone}
                                onChangeText={val => this.handleChange('phone', val)} />
                        </Item>
                        <Item inlineLabel>
                            <Label>Number of Roomate Allow</Label>
                            <Input keyboardType="numeric"
                                value={this.state.numOfRoomates}
                                onChangeText={val => this.handleChange('numOfRoomates', val)} />
                        </Item>
                        <Picker
                            mode="dropdown"
                            iosHeader="Select mate gender"
                            iosIcon={<Icon name="man" />}
                            style={{ width: undefined }}
                            selectedValue={this.state.genderSelect}
                            onValueChange={(v) => this.onGenderChange(v)}
                        >
                            <Picker.Item label="Any gender" value="any" />
                            <Picker.Item label="Male Only" value="male" />
                            <Picker.Item label="Female Only" value="female" />
                        </Picker>

                        <Spacer size={10} />
                        <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>Add Images</Text>
                        <Spacer size={10} />

                        <Button block rounded success onPress={() => this.handlePickImage()}>
                            <Text>Choose Image from Photos</Text>
                        </Button>
                        <View style={{ padding: 10 }}>
                            {this.state.images.length ? renderImages : null}
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
                    </Form>
                    <View
                        style={{
                            borderBottomColor: '#ccc',
                            borderBottomWidth: 1,
                            marginTop: 20,
                            marginBottom: 20
                        }}
                    />
                    <Button block primary onPress={() => this.handlePostRoom()}>
                        <Text>Post this room!!</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

export default AddRoom;