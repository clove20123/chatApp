import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";


export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      bgColor: "black",
      border: 0,
    };
  }

  render() {
    return (
      //added background image
      <ImageBackground
        style={styles.imgBackground}
        resizeMode="cover"
        source={require("../assets/Background-Image.png")}
      >
        {/*defined the main view */}
        <View style={styles.mainContainer}>
          <Text style={styles.title}>
            <Text style={styles.title}>chatApp</Text>
          </Text>
          {/*container which contains a text input, a color picker and a button */}
          <View style={styles.container}>
            {/*text input */}
            <View style={styles.textInputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: this.state.bgColor,
                  },
                ]}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder="Enter your name..."
                placeholderTextColor="rgba(255, 255, 255, 1)"
              />
            </View>
            {/*choose color */}
            <View style={styles.colorPickerContainer}>
              <Text style={styles.chooseColor}>Choose Background Color:</Text>
              <View style={styles.colorPicker}>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Black Color"
                  accessibilityHint="You can choose the color black as contrast color in chat."
                  style={[
                    styles.colors,
                    styles.black,
                    { borderWidth: this.state.border },
                  ]}
                  onPress={() => this.setState({ bgColor: "#090C08" })}
                ></TouchableOpacity>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Dark Blue"
                  accessibilityHint="You can choose the color dark blue as contrast color in chat."
                  style={[
                    styles.colors,
                    styles.darkBlue,
                    { borderWidth: this.state.border },
                  ]}
                  onPress={() => this.setState({ bgColor: "#474056" })}
                ></TouchableOpacity>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Lightblue Color"
                  accessibilityHint="You can choose the color lightblue as contrast color in chat."
                  style={[
                    styles.colors,
                    styles.lightBlue,
                    {
                      borderWidth: this.state.border,
                    },
                  ]}
                  onPress={() => this.setState({ bgColor: "#8A95A5" })}
                ></TouchableOpacity>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Olive green Color"
                  accessibilityHint="You can choose the color Olive green as contrast color in chat."
                  style={[
                    styles.colors,
                    styles.oliveGreen,
                    { borderWidth: this.state.border },
                  ]}
                  onPress={() => this.setState({ bgColor: "#B9C6AE" })}
                ></TouchableOpacity>
              </View>
            </View>
            {/*chat room button */}
            <View>
              <TouchableOpacity
                style={[
                  styles.startChatting,
                  { backgroundColor: this.state.bgColor },
                ]}
                onPress={() =>
                  this.props.navigation.navigate("Chat", {
                    name: this.state.name,
                    bgColor: this.state.bgColor,
                  })
                }
              >
                <Text style={styles.buttonText}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column-reverse",
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#fff",
    position: "absolute",
    top: 100,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    textShadowColor: "#000",
  },
  container: {
    width: "88%",
    height: 320,
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  textInputContainer: {
    flex: 1,
    width: "88%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  textInput: {
    color: "#fff",
    top: 25,
    height: 60,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "300",
    paddingLeft: 45,
    fontStyle: "italic",
    borderColor: "#777",
    opacity: 0.5,
  },

  startChatting: {
    flex: 1,
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#757083",
    width: "88%",
    height: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textShadowColor: "#000",
  },
  imgBackground: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  colorPickerContainer: {
    position: "absolute",
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
  chooseColor: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginLeft: 10,
  },
  colorPicker: {
    flexDirection: "row",
    marginTop: 15,
  },
  colors: {
    width: 45,
    height: 45,
    margin: 8,
    marginTop: 0,
    borderRadius: 45 / 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  black: {
    backgroundColor: "#090C08",
  },
  darkBlue: {
    backgroundColor: "#474056",
  },
  lightBlue: {
    backgroundColor: "#8A95A5",
  },
  oliveGreen: {
    backgroundColor: "#B9C6AE",
  },


});