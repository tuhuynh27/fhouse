import React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { toCurrency } from '../../common/util';

import Slider from "react-native-slider";

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0.25
    };
  }

  render() {
    return (
      <Container>
        <Content padder>
          <View>
            <Text style={{ fontWeight: 'bold' }}>Price range</Text>

            <Slider
              value={this.state.value}
              onValueChange={value => this.setState({ value })}
              animateTransitions={true}
            />

            <Text>
              Price range max to <Text style={{ fontWeight: 'bold' }}>{toCurrency(this.state.value * 10000000)}</Text>VND
            </Text>
          </View>
        </Content>
      </Container>
    );
  }
}

export default SearchPage;