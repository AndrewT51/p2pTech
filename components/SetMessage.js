import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
} from 'react-native';

export default class SetMessage extends Component {
  render(){
    return (
      <View style={[ {borderColor: this.props.canUpdate ? 'blue' : 'red' }, styles.inputGroup ]}>
         <TextInput
          style={styles.input }
          onChangeText={this.props.onTextChange}
          value={this.props.textValue}
          onSubmitEditing={ this.props.onUpdateButtonPressed}
          placeholder={this.props.message }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputGroup: {
    margin: 3,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent:'space-around',
    borderWidth: 1,
  },
  input: {
    padding: 10,
    height: 40,
    flex: 2,
    borderColor: 'lightgrey',
    borderWidth: 1
  }
});
