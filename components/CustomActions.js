import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Button, View } from 'react-native';
import React from 'react';

export default class CustomActions extends Component {

  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
 
    if(status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));
 
      if (!result.cancelled) {
        this.setState({
          image: result
        });  
      }
 
    }
  }

  render() {
    return (
      
      

  <View style={{flex: 1, justifyContent: 'center'}}>
  <Button
    title="Pick an image from the library"
    onPress={this.pickImage}
  />

  <Button
    title="Take a photo"
    onPress={this.takePhoto}
  />
</View>
    );
  }
}