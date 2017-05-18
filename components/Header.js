import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch
} from 'react-native'

export default class Header extends Component {
  state = {
    switchStatus: true
  }
  render(){
    return(
      <View style={styles.header}>
        <Text style={styles.headerText }>Header</Text>
        <Switch
          style={ styles.switch }
          onValueChange={(val) => this.setState({switchStatus: val})}
          value={this.state.switchStatus}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'lightgrey',
  },
  switch:{
    flex: 1
  },
  headerText: {
    flex: 3,
    textAlign: 'center'
  }
});