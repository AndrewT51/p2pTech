import React, { Component } from 'react';
import StatusLight from './StatusLight';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

export default class PeerStatusBlock extends Component {

  updateMessage(){
    const { onPressPeer, message } = this.props;
    onPressPeer(message);
  }

  render(){
    const { searchForPeerType, peerID, proximity } = this.props;
    const colours = [ 'white', 'red', 'red', 'orange', 'green', 'green' ];

    return (
      <TouchableHighlight
        onPress={ this.updateMessage.bind(this) }
      >
        <View style={ styles.peerBlock }>
          <Text style={ styles.userID }>
            { searchForPeerType }: {peerID.split('-')[0]}
          </Text>
          <View style={styles.statusLight} >
            <StatusLight colour={colours[proximity] }/>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({

  userID: {
    flex:5,
    marginLeft: 15,
  },
  statusLight:{
    flex: 1,
  },
  peerBlock: {
    flexDirection: 'row',
    backgroundColor: '#E8FFFF',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    alignItems:'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 2,
    marginBottom: 2
  },

});
