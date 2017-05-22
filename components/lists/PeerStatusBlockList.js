import React, { Component } from 'react';
import PeerStatusBlock from '../PeerStatusBlock';
import {
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

export default class PeerStatusBlockList extends Component {
  renderObjectBlocksInOrder(){
    const { objectPeers, onPressPeer, searchForPeerType } = this.props;
    return Object.keys(objectPeers).sort((key1, key2) => objectPeers[key2].range - objectPeers[key1].range)
    .map( peerID => <PeerStatusBlock
      peerID={peerID}
      key={peerID}
      proximity={objectPeers[peerID].range}
      message={objectPeers[peerID].message}
      onPressPeer={onPressPeer}
      searchForPeerType={searchForPeerType}
    />);
  }

  render(){
    return (
      <View style={styles.listContainer}>
        <ScrollView style={styles.container}>
            {this.renderObjectBlocksInOrder.call(this)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex:1,
    flexDirection:'row'
  },
});
