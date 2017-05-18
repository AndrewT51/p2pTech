import React, { Component } from 'react'
import PeerStatusBlock from '../PeerStatusBlock'
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button
} from 'react-native'


export default class PeerStatusBlockList extends Component {

  renderBlocks(){
    if ( !this.props.peers.length ) return null
    return (
     this.props.peers.map((peer) => {
        return <PeerStatusBlock peerID={peer} key={peer} proximity={this.props.proximity} />
      })
    )
  }

  render(){
    return (
      <View style={styles.container}>
        {this.renderBlocks.call(this)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignSelf: 'stretch'

  },
});

