import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import p2pkit from 'react-native-p2pkit';

const p2pkitCallback = {
  onException: (exceptionMessage) => {
    console.log(exceptionMessage.message)
  },

  onEnabled: () => {
    console.log('p2pkit is enabled')
    p2pkit.enableProximityRanging()
    p2pkit.startDiscovery('', p2pkit.HIGH_PERFORMANCE) //base64 encoded Data (bytes)
  },

  onDisabled: () => {
    console.log('p2pkit is disabled')
  },

  // Refer to platform specific API for error codes
  onError: (errorObject) => {
    console.log('p2pkit failed to enable on platform ' + errorObject.platform + ' with error code ' + errorObject.errorCode)
  },

  onDiscoveryStateChanged: (discoveryStateObject) => {
    console.log('discovery state updated on platform ' + discoveryStateObject.platform + ' with error code ' + discoveryStateObject.state)
  },

  onPeerDiscovered: (peer) => {
    console.log('peer discovered ' + peer.peerID)
  },

  onPeerLost: (peer) => {
    console.log('peer lost ' + peer.peerID)
  },

  onPeerUpdatedDiscoveryInfo: (peer) => {
    console.log('discovery info updated for peer ' + peer.peerID + ' info ' + peer.discoveryInfo)
  },

  onProximityStrengthChanged: (peer) => {
    console.log('proximity strength changed for peer ' + peer.peerID + ' proximity strength ' + peer.proximityStrength)
  },

  onGetMyPeerId: (reply) => {
    console.log(reply.myPeerId)
  },

  onGetDiscoveryPowerMode: (reply) => {
  	console.log(reply.discoveryPowerMode)
  }
}

export default class Vista extends Component {
  startP2PKit() {
    p2pkit.enable('f80a76326b5d4cf69a635ba88780e7fd', p2pkitCallback)
  }

  componentDidMount() {
    this.startP2PKit()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Vista', () => Vista);
