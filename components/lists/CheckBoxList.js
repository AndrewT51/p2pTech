import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import CheckBox from 'react-native-checkbox';

export default class CheckBoxList extends Component {
  onChange(key, value){
    let keyValueChange ={};
    keyValueChange[key] = !value;
    this.props.onChange(keyValueChange);
  }

  renderOptions(){
    return Object.keys(this.props.userPrefs).map((option) => {
      return <CheckBox
      label={option}
      key={option}
      checked={ this.props.userPrefs[option]}
      onChange={ this.onChange.bind(this, option) }
    />;
    });
  }

  render(){
    return(
      <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <View style={ styles.container} >
          { this.renderOptions() }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    height: 100,
    marginBottom: 50,
    // flexDirection:'row',
    justifyContent: 'space-around',
    // alignItems: 'center',
    alignSelf: 'stretch',
    flexWrap:'wrap'
  },

});