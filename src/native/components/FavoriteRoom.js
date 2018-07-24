import React from 'react';

import { FlatList, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Card, CardItem, Text, Icon } from 'native-base';

import NoFavoriteRoom from './About';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { getUserDataByID } from '../../actions/member';

import { toCurrency, toTitleCase } from '../../common/util';
import Spacer from './Spacer';

import moment from 'moment';

class FavoriteRoom extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.member.email || !this.props.member.favoriteRoom || this.props.member.favoriteRoom.length === 0) {
      return <NoFavoriteRoom />;
    }

    const { favoriteRoom } = this.props.member;

    const keyExtractor = item => item;
    const onPress = item => Actions.recipe({ match: { params: { id: item.toString() } } });
    const keys = favoriteRoom;
    const { recipes } = this.props;

    return (
      <Container>
        <Content padder>
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
  member: state.member || {},
  recipes: state.recipes.recipes || {}
});

const mapDispatchToProps = {
  //
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteRoom);