import React from 'react';
import { Scene, Tabs, Stack, Actions } from 'react-native-router-flux';
import { Icon, Button, Toast, Text } from 'native-base';

import DefaultProps from '../constants/navigation';
import AppConfig from '../../constants/config';

import RecipesContainer from '../../containers/Recipes';
import RecipesComponent from '../components/Recipes';
import RecipeViewComponent from '../components/Recipe';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/SignUp';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/Login';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/ForgotPassword';

import LocaleContainer from '../../containers/Locale';
import LocaleComponent from '../components/Locale';

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/UpdateProfile';

import MemberContainer from '../../containers/Member';
import ProfileComponent from '../components/Profile';

import AboutComponent from '../components/About';
import AddRoomComponent from '../components/AddRoom';

import ChatComponent from '../components/ChatPage';
import SearchComponent from '../components/SearchPage';
import FavoriteComponent from '../components/FavoriteRoom';

const onAddRoom = () => {
  Actions.addRoom();
}

const onSearchRoom = () => {
  Actions.searchRoom();
}

const Index = (
  <Stack>
    <Scene hideNavBar>
      <Tabs
        key="tabbar"
        swipeEnabled
        type="replace"
        showLabel={false}
        tabBarPosition="bottom"
        {...DefaultProps.tabProps}
      >
        <Stack
          key="recipes"
          title="Rooms"
          icon={() => <Icon name="home" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="recipes" title="SUGGESTED ROOM" component={RecipesContainer} Layout={RecipesComponent}
            renderRightButton={<Button transparent onPress={() => onAddRoom()}><Icon name="add" style={{ marginRight: 20 }} /></Button>}
            renderLeftButton={<Button transparent onPress={() => onSearchRoom()}><Icon name="search" style={{ marginLeft: 20 }} /></Button>}
            navigationBarTitleImage={require('../../images/app-icon.png')}
            navigationBarTitleImageStyle={{ display: 'flex', width: 35, height: 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}
          />
          <Scene key="addRoom" title="NEW ROOM" hideTabBar={true} component={AddRoomComponent}
          />
          <Scene key="searchRoom" title="SEARCH ROOM" hideTabBar={true} component={SearchComponent}></Scene>
        </Stack>

        <Stack
          key="love"
          title="FAVORITE ROOMS"
          icon={() => <Icon name="heart" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="love" component={FavoriteComponent} />
        </Stack>

        <Stack
          key="chat"
          title="F-HOUSE SUPPORT"
          icon={() => <Icon name="chatbubbles" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="chat" component={ChatComponent} />
        </Stack>

        <Stack
          key="profile"
          title="PROFILE"
          icon={() => <Icon name="people" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="profileHome" component={MemberContainer} Layout={ProfileComponent} />
          <Scene
            back
            key="signUp"
            title="SIGN UP"
            {...DefaultProps.navbarProps}
            component={SignUpContainer}
            Layout={SignUpComponent}
          />
          <Scene
            back
            key="login"
            title="LOGIN"
            {...DefaultProps.navbarProps}
            component={LoginContainer}
            Layout={LoginComponent}
          />
          <Scene
            back
            key="forgotPassword"
            title="FORGOT PASSWORD"
            {...DefaultProps.navbarProps}
            component={ForgotPasswordContainer}
            Layout={ForgotPasswordComponent}
          />
          <Scene
            back
            key="locale"
            title="CHANGE LANGUAGE"
            {...DefaultProps.navbarProps}
            component={LocaleContainer}
            Layout={LocaleComponent}
          />
          <Scene
            back
            key="updateProfile"
            title="UPDATE PROFILE"
            {...DefaultProps.navbarProps}
            component={UpdateProfileContainer}
            Layout={UpdateProfileComponent}
          />
        </Stack>
      </Tabs>
    </Scene>

    <Scene
      back
      clone
      key="recipe"
      title="ROOM"
      {...DefaultProps.navbarProps}
      component={RecipesContainer}
      Layout={RecipeViewComponent}
    />
  </Stack>
);

export default Index;