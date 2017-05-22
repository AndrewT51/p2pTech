import React, { Component } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'

export default class StatusLight extends Component {
  render(){
    return(
      <View
        style={[{backgroundColor: this.props.colour},styles.status]}
      >
      </View>
    )
  }
}

const styles = StyleSheet.create({
  status: {
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: 'black',
    width: 20,
    height: 20,
  }
});