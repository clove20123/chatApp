//  import react component
import React, { Component } from "react";
//import relevant components from react native
import NetInfo from "@react-native-community/netinfo";

import { StyleSheet, Text, View, Platform, AsyncStorage} from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
//import KeyboardSpacer from "react-native-keyboard-spacer";
//import custom CustomActions
import CustomActions from "./CustomActions";
//import MapView
import MapView from "react-native-maps";
import { Constants, Location, Permissions } from 'expo';

import firebase from 'firebase';
import firestore from 'firebase';
// create Screen2 (Chat) class
//import firebase
 //const firebase = require("firebase");
 //require("firebase/firestore");

// create Screen2 (Chat) class
export default class Chat extends Component {
  constructor() {
    super();

    /**
     * initializing firebase
     */
    // firebase adding credential in order to connect to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBePiYi9xB7Za9c_vnedrPR60LCW9llSZM",
        authDomain: "test-clove.firebaseapp.com",
        projectId: "test-clove",
        storageBucket: "test-clove.appspot.com",
        messagingSenderId: "431017489723",
        appId: "1:431017489723:web:5ab4b1408110b569b6b31e",
        measurementId: "G-M7J5RG6TTF"
  
      });
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");

    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
      image: null,
    };
  }

  // temporarly storage of messages
  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // firebase storage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };


   componentDidMount() {
     NetInfo.addEventListener((state) => {
       this.handleConnectivityChange(state);
     });

     NetInfo.fetch().then((state) => {
       const isConnected = state.isConnected;
       if (isConnected) {
         this.setState({
           isConnected: true,
         });

         this.authUnsubscribe = firebase
           .auth()
           .onAuthStateChanged(async (user) => {
             if (!user) {
               await firebase.auth().signInAnonymously();
             }

             this.setState({
               uid: user.uid,
               messages: [],
             });

             this.unsubscribe = this.referenceChatMessages
               .orderBy("createdAt", "desc")
               .onSnapshot(this.onCollectionUpdate);
           });
       } else {
         this.setState({
           isConnected: false,
         });

         this.getMessages();
       }
     });
   }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: []
      });

      this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  /**
   * onCollectionUpdte takes snapshot on collection update
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });

    this.setState({
      messages,
    });
  };

  /**
   * checks networkstatus of user
   */
  handleConnectivityChange = (state) => {
    const isConnected = state.isConnected;
    if (isConnected == true) {
      this.setState({
        isConnected: true,
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    } else {
      this.setState({
        isConnected: false,
      });
    }
  };

  /**
   * adds the message object to firestore, fired by onSend function
   */
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };
  //define title in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.userName}'s Chat`,
    };
  };

  /**
   * handles actions when user hits send-button
   */
  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  };

  /**
   * hides inputbar when offline
   */
  renderInputToolbar = (props) => {
    console.log("renderInputToolbar --> props", props.isConnected);
    if (props.isConnected === false) {
      return <InputToolbar {...props} />
    } else {
      return <InputToolbar {...props} />;
    }
  };

  /**
   * displays the communication features
   */
  renderCustomActions = (props) => <CustomActions {...props} />;

  //custom map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
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

  //render components
  render() {
    return (
      //fullscreen component
      <View
        style={{
          flex: 1,
          //backgroundColor: this.props.navigation.state.params.backgroundColor,
        }}
      >
        <GiftedChat
          messages={this.state.messages}
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
          }}
        />
        {/* {Platform.OS === "android" ? <KeyboardSpacer /> : null} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({});