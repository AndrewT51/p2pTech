import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button
} from 'react-native'



export default class PeerStatusBlock extends Component {


  render(){
    return (
      <View style={ styles.peerBlock }>
        <Text style={ styles.userID }>
          User: {this.props.peerID.split('-')[0]}
        </Text>

      </View>
    )
  }
}

const styles = StyleSheet.create({


  userID: {
    marginLeft: 15,
    justifyContent: 'center',
  },

  peerBlock: {
    backgroundColor: 'green',
    justifyContent: 'center',
    height: 50,
    marginTop: 2,
    marginBottom: 2
  },

});
