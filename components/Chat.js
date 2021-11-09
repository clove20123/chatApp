import React from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { View, Text, Button, StyleSheet, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

//Firebase database
const firebase = require('firebase');
require('firebase/firestore');

//import async storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';




export default class Chat extends React.Component {
  constructor() {
    super();
    const firebaseConfig = {
      apiKey: "AIzaSyBePiYi9xB7Za9c_vnedrPR60LCW9llSZM",
      authDomain: "test-clove.firebaseapp.com",
      projectId: "test-clove",
      storageBucket: "test-clove.appspot.com",
      messagingSenderId: "431017489723",
      appId: "1:431017489723:web:5ab4b1408110b569b6b31e",
      measurementId: "G-M7J5RG6TTF"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // References Firebase messages
    this.referenceChatMessages = firebase.firestore().collection('messages');
    //this.referenceMessageUser = null;

    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '', 
      },
      image: null,
    };
  }
  

  componentDidMount() {
    this.getMessages();

    //check if user online or offline
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
      } else {
        console.log('offline');
        this.setState({ isConnected: false })
        // Calls messeages from offline storage
        this.getMessages();
      }
    });

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
         },
         {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
         },
      ]
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.authUnsubscribe();
  }

  //Get messages
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Add messages to database
  addMessages() { 
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  // Save Messages to local storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //delete messsage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessages();
      // Calls function saves to local storage
      this.saveMessages();
    });
  }

    // Retrieve current messages and store them in the state: messages
    onCollectionUpdate = (querySnapshot) => {
      const messages = [];
      // go through each document
      querySnapshot.forEach((doc) => {
        // get the QueryDocumentSnapshot's data
        let data = doc.data();
        messages.push({
          _id: data._id,
          createdAt: data.createdAt.toDate(),
          text: data.text || '',
          user: {
            _id: data.user._id,
            name: data.user.name,
          }
        });
      });
      this.setState({ 
        messages,
     });
    }

//if offline dont render inputbar
renderInputToolbar = (props) => {
  console.log("renderInputToolbar --> props", props.isConnected);
  if (props.isConnected === false) {
    return <InputToolbar {...props} />
  } else {
    return <InputToolbar {...props} />;
  }
};

// change chat bubble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  renderCustomActions(props) {
    return <CustomActions { ...props } />;
  };

    // Renders Map view
    renderCustomView(props) {
      const { currentMessage } = props;
      if (currentMessage.location) {
        return (
          <MapView
            style={{ width: 150, height: 100, borderRadius: 13, margin: 8 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        );
      }
      return null;
    }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1}}>
       <GiftedChat
         renderBubble={this.renderBubble.bind(this)}
         renderInputToolbar={this.renderInputToolbar.bind(this)}
         renderActions={ this.renderCustomActions }
         renderCustomView={this.renderCustomView}
         messages={this.state.messages}
         onSend={messages => this.onSend(messages)}
         user={this.state.user}
       />
      {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    )
  }
}