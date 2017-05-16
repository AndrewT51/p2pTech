import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import p2pkit from 'react-native-p2pkit';

export default class Vista extends Component {
  constructor(props) {
    super(props)

    this.state = {
      log: [],
      discoveredPeers: []
    }

    this.p2pkitCallback = {
      onException: (exceptionMessage) => {
        console.log(exceptionMessage.message)
        this.log(exceptionMessage.message)
      },

      onEnabled: () => {
        console.log('p2pkit is enabled')
        this.log('p2pkit is enabled')
        p2pkit.enableProximityRanging()
        p2pkit.startDiscovery('', p2pkit.HIGH_PERFORMANCE) //base64 encoded Data (bytes)
      },

      onDisabled: () => {
        console.log('p2pkit is disabled')
        this.log('p2pkit is disabled')
      },

      // Refer to platform specific API for error codes
      onError: (errorObject) => {
        console.log('p2pkit failed to enable on platform ' + errorObject.platform + ' with error code ' + errorObject.errorCode)
        this.log('p2pkit failed to enable on platform ' + errorObject.platform + ' with error code ' + errorObject.errorCode)
      },

      onDiscoveryStateChanged: (discoveryStateObject) => {
        console.log('discoveryStateObject', discoveryStateObject)
        this.log('discoveryStateObject', discoveryStateObject)
        console.log('discovery state updated on platform ' + discoveryStateObject.platform + ' with error code ' + discoveryStateObject.state)
        this.log('discovery state updated on platform ' + discoveryStateObject.platform + ' with error code ' + discoveryStateObject.state)
      },

      onPeerDiscovered: (peer) => {
        console.log('peer discovered ' + peer.peerID)
        this.log('peer discovered ' + peer.peerID)
        this.setState({
          discoveredPeers: [...this.state.discoveredPeers, peer.peerID]
        })
      },

      onPeerLost: (peer) => {
        console.log('peer lost ' + peer.peerID)
        this.log('peer lost ' + peer.peerID)
      },

      onPeerUpdatedDiscoveryInfo: (peer) => {
        console.log('discovery info updated for peer ' + peer.peerID + ' info ' + peer.discoveryInfo)
        this.log('discovery info updated for peer ' + peer.peerID + ' info ' + peer.discoveryInfo)
      },

      onProximityStrengthChanged: (peer) => {
        console.log('proximity strength changed for peer ' + peer.peerID + ' proximity strength ' + peer.proximityStrength)
        this.log('proximity strength changed for peer ' + peer.peerID + ' proximity strength ' + peer.proximityStrength)
      },

      onGetMyPeerId: (reply) => {
        console.log(reply.myPeerId)
        this.log(reply.myPeerId)
      },

      onGetDiscoveryPowerMode: (reply) => {
      	console.log(reply.discoveryPowerMode)
      	this.log(reply.discoveryPowerMode)
      }
    }
  }

  log = (message) => {
    this.setState({
      log: [...this.state.log, message]
    })
  }

  startP2PKit = () => {
    console.log('this.p2pkitCallback', this.p2pkitCallback)
    p2pkit.enable('f80a76326b5d4cf69a635ba88780e7fd', this.p2pkitCallback)
  }

  componentDidMount() {
    this.startP2PKit()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Discovered Peers:
        </Text>
        <Text style={styles.instructions}>
          {this.state.discoveredPeers.join(', ')}
        </Text>
        <Text style={styles.instructions}>
          {this.state.log.join('\n')}
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
