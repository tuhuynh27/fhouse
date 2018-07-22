import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Form, Item, Input, Text, Button, View } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from './Loading';
import Messages from './Messages';
import Spacer from './Spacer';

class Login extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    locale: PropTypes.string,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: null,
    locale: null,
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      email: (props.member && props.member.email) ? props.member.email : '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  handleSubmit = () => {
    this.props.onFormSubmit(this.state)
      .then(() => Actions.pop())
      .catch(e => console.log(`Error: ${e}`));
  }

  render() {
    const { loading, error, locale } = this.props;

    if (loading) return <Loading />;

    return (
      <Container>
        <Content>
          <View padder>
            {error && <Messages message={error} />}
          </View>

          <Form>
            <Item>
              <Input
                placeholder="Email"
                autoCapitalize="none"
                value={this.state.email}
                keyboardType="email-address"
                onChangeText={v => this.handleChange('email', v)}
              />
            </Item>
            <Item>
              <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={v => this.handleChange('password', v)}
              />
            </Item>

            <Spacer size={10} />

            <View padder>
              <Button primary block onPress={this.handleSubmit}>
                <Text>Login</Text>
              </Button>
              <Button transparent dark block onPress={Actions.signUp}>
                <Text>New member? Tap here!!</Text>
              </Button>
              {/* <Button transparent dark block>
                <Text>Forgot Password</Text>
              </Button> */}
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default (Login);
