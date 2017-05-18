import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button
} from 'react-native'

export default class SetMessage extends Component {
  render(){
    return (
      <View style={styles.inputGroup}>
         <TextInput
          style={styles.input }
          // onChangeText={(text) => this.setState({text})}
          value="blah"
        />
        <View
          style={styles.button}
        >
        <Button
          title='Update'
          onPress={() => console.log('yippee')}
        />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent:'space-around',
  },
  input: {
    padding: 10,
    height: 40,
    flex: 2,
    borderColor: 'lightgrey',
    borderWidth: 1
  },
  button: {
    flex: 1,
    borderColor: 'lightgrey',
    borderWidth: 1
  }
});