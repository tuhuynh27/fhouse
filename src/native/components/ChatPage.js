import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import uuid from 'uuid';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          _id: uuid.v4(),
          text: 'Hello, can I help you?',
          createdAt: new Date(),
          user: {
            _id: -1,
            name: 'FHouse Supporter',
            avatar: 'https://placeimg.com/140/140/tech/grayscale',
          },
        },
      ]
    };
  }

  componentWillMount() {
    this.render();
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    switch (messages[0].text.trim().toLowerCase()) {
      case "hello": case "hi": case "ahihi": case "good morning": case "good evening": case "good afternoon": case "hey":
        this.onBot('Hi, how are you doing? :)');
        break;
      case "find me a room": case "find for me a room": case "find room": case "i want room":
        this.onBot(`I'm finding and will return to you the result at soon at possbile!`);
        setTimeout(() => {
          this.onBot('Sorry but I cannot find any room now, please try again later.');
        }, 3000);
        break;
      case "find me any room": case "find any room":
        this.onBot(`Sure! Please wait, I'm finding.`);
        setTimeout(() => {
          this.onBot('Here there is a nearby room at 32 To Ky, Trung My Tay, 12 District. The square is 25m2 and cost 2m5 VND per month, here is the phone number: 01216870446.');
        }, 4000);
        break;
      case "thanks": case "thank you":
        this.onBot('You are welcome! :)');
        break;
      case "need support":
        this.onBot(`Sure! Please wait when I connect you to the supporter.`);
        setTimeout(() => {
          this.onBot('Sorry but none of them are here now, please try again later.');
        }, 5000);
        break;
      default:
        this.onBot(`Sorry, the bot cannot understand you. You can request for a real-person support by type 'Need support'.`);
        break;
    }
  }

  onBot(text) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, {
        _id: uuid.v4(),
        text: text,
        createdAt: new Date(),
        user: {
          _id: -1,
          name: 'FHouse Supporter',
          avatar: 'https://placeimg.com/140/140/tech/grayscale',
        },
      }, )
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}