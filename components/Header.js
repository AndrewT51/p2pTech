import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch
} from 'react-native';

export default class Header extends Component {

  render(){
          // onValueChange={(val) => this.setState({switchStatus: val})}
    return(
      <View style={styles.header}>
        <Text style={styles.headerText }>{this.props.peerType}</Text>
        <Switch
          style={ styles.switch }
          onValueChange={this.props.switchType}
          value={this.props.isKiosk}
        />
      </View>
    );
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