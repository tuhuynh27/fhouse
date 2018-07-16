import React from 'react';
import { Container, Content, Text, H3, Form, Item, Label, Input, Picker, Icon, Button, List, ListItem, CheckBox, Body, Toast } from 'native-base';
import { View, Image } from 'react-native';
import Spacer from './Spacer';
import { ImagePicker } from 'expo';
import { Actions } from 'react-native-router-flux';

import { normalizeStr } from '../../common/util';

class AddRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            districtSelect: 'binh thanh',
            genderSelect: 'any',
            image: null,
            listUtilities: [
                "parking place",
                "room toilet"
            ],
            listEquipments: [
                "kitchen",
                "bed"
            ],
            utility: '',
            equipment: ''
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
        this.handleGetPermission();

        let result = await ImagePicker.launchImageLibraryAsync({
            // Set image size
            // allowsEditing: true,
            // aspect: [16, 9],
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    handleGetPermission = async () => {
        const { Location, Permissions } = Expo;
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            // Granted
        } else {
            throw new Error('Location permission not granted');
        }
    }

    handleAddUtility() {
        let listUtilities = this.state.listUtilities;
        listUtilities.push(this.state.utility);

        this.setState({
            listUtilities,
            utility: null
        });
    }

    handleRemoveUtility(item) {
        let listUtilities = this.state.listUtilities;
        const index = this.state.listUtilities.indexOf(item);

        if (index !== -1) {
            listUtilities.splice(index, 1);
        }

        this.setState({
            listUtilities
        });
    }

    handleAddEquipment() {
        let listEquipments = this.state.listEquipments;
        listEquipments.push(this.state.equipment);

        this.setState({
            listEquipments,
            equipment: null
        });
    }

    handleRemoveEquipment(item) {
        let listEquipments = this.state.listEquipments;
        const index = this.state.listEquipments.indexOf(item);

        if (index !== -1) {
            listEquipments.splice(index, 1);
        }

        this.setState({
            listEquipments
        });
    }

    handlePostRoom() {
        Toast.show({
            text: "Room posted success and waiting for admin approval",
            duration: 3000,
            type: "success",
            position: "top"
        });

        Actions.recipes();
    }

    render() {
        const renderListUtilities = this.state.listUtilities.map(item => (
            <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
                <CheckBox checked={true} color="blue" onPress={() => this.handleRemoveUtility(item)} />
                <Body><Text>{normalizeStr(item)}</Text></Body>
            </ListItem>
        ));

        const renderListEquipments = this.state.listEquipments.map(item => (
            <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
                <CheckBox checked={true} color="blue" onPress={() => this.handleRemoveEquipment(item)} />
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
                            <Input />
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
                            <Input keyboardType="numeric" />
                        </Item>
                        <Item inlineLabel>
                            <Label>Price (in VND)</Label>
                            <Input keyboardType="numeric" />
                        </Item>
                        <Item inlineLabel>
                            <Label>Phone Number</Label>
                            <Input keyboardType="numeric" />
                        </Item>
                        <Item inlineLabel>
                            <Label>Number of Roomate Allow</Label>
                            <Input keyboardType="numeric" />
                        </Item>
                        <Picker
                            mode="dropdown"
                            iosHeader="Select mate gender"
                            iosIcon={<Icon name="man" />}
                            style={{ width: undefined }}
                            selectedValue={this.state.genderSelect}
                            onValueChange={(v) => this.onGenderChange(v)}
                        >
                            <Picker.Item label="Allow any gender" value="any" />
                            <Picker.Item label="Only for male" value="male" />
                            <Picker.Item label="Only for female" value="female" />
                        </Picker>

                        <Spacer size={10} />
                        <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>Add Images</Text>
                        <Spacer size={10} />

                        <Button block rounded success onPress={() => this.handlePickImage()}>
                            <Text>Choose Image from Photos</Text>
                        </Button>
                        <View style={{ padding: 10 }}>
                            {this.state.image &&
                                <Image source={{ uri: this.state.image }} style={{ height: 200, width: null, flex: 1 }} />}
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
                        <Button block rounded info onPress={() => this.handleAddUtility()}>
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
                        <Button block rounded info onPress={() => this.handleAddEquipment()}>
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