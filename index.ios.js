import React, { Component } from 'react';
import PeerStatusBlockList from './components/lists/PeerStatusBlockList'
import Header from './components/Header';
import SetMessage from './components/SetMessage'
import base64 from 'base-64'
import {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  StatusBar,
  TextInput
} from 'react-native';
import p2pkit from 'react-native-p2pkit';

export default class Vista extends Component {
  constructor(props) {
    super(props)

    this.state = {
      log: [],
      discoveredPeers: ['2342134-2341234-12341234-2341234','45456-2452345-2345234-23453'],
      finderStatus: false,
      proximity: {},
      text: ''
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
        this.setState({finderStatus:true })
        var str = base64.encode('hello');
         p2pkit.pushNewDiscoveryInfo(str)
      },



      onDisabled: () => {
        const peerID = '4b1ec958-07d7-41bd-a570-c66d48fc4a7a'
        console.log('peer lost ' + peerID)


        console.log('Pre state', this.state.proximity)
        console.log('ID', peerID)
        const { peerID: omittedField, ...proximity} = this.state.proximity;
        console.log('In between', proximity)
        console.log('Omitted', omittedField)
        this.setState({ proximity }, () => {
          console.log('Post State', this.state.proximity)
        })
        this.setState({finderStatus:false })
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
        console.log('discovery state updated on platform ' + discoveryStateObject.platform + ' with status code ' + discoveryStateObject.state)
        this.log('discovery state updated on platform ' + discoveryStateObject.platform + ' with status code ' + discoveryStateObject.state)
      },

      onPeerDiscovered: (peer) => {
        const { peerID, proximityStrength } = peer
        let tempObj = this.state.proximity
        tempObj[peerID] = proximityStrength || 'Finding...';
        this.setState({ proximity: tempObj })
        console.log('peer discovered ' + peerID)
        this.log('peer discovered ' + peerID)
        if ( this.state.discoveredPeers.indexOf(peerID) < 0 ){
          this.setState({
            discoveredPeers: [...this.state.discoveredPeers, peerID]
          })
        }
      },

      onPeerLost: (peer) => {
        const { peerID } = peer
        console.log('peer lost ' + peerID)


        console.log('Pre state', this.state.proximity)
        console.log('ID', peerID)
        const { peerID: omittedField, ...proximity} = this.state.proximity;
        console.log('In between', proximity)
        this.setState({ proximity }, () => {
          console.log('Post State', this.state.proximity)
        })

        let peerIndex = this.state.discoveredPeers.indexOf(peerID)
        let newPeerArray = this.state.discoveredPeers.slice(0, peerIndex).concat(this.state.discoveredPeers.slice(peerIndex))
        this.setState({ discoveredPeers: newPeerArray})
      },

      onPeerUpdatedDiscoveryInfo: (peer) => {
        console.log('discovery info updated for peer ' + peer.peerID + ' info ' + peer.discoveryInfo)
        this.log('discovery info updated for peer ' + peer.peerID + ' info ' + peer.discoveryInfo)
      },

      onProximityStrengthChanged: (peer) => {
        const { peerID, proximityStrength } = peer
        let tempObj = this.state.proximity
        tempObj[peerID] = proximityStrength || 'Finding...';
        this.setState({ proximity: tempObj })
        console.log('proximity strength changed for peer ' + peerID + ' proximity strength ' + proximityStrength)
        this.log('proximity strength changed for peer ' + peerID + ' proximity strength ' + proximityStrength)
      },

      onGetMyPeerId: (reply) => {
        console.log('Reply',reply)
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

  renderDiscoveredPeers = () => {
    return this.state.discoveredPeers.map((peer)=>{
      console.log('Peer',peer)
      return (
        <View style={styles.peerBlock}>
          <Text>
          { peer.split('-')[0] }
          </Text>
        </View>
      )
    })
  }

  // componentDidMount() {
  //   this.startP2PKit()
  // }

  toggleProximityFinder(){
    if (this.state.finderStatus){
      return p2pkit.disable()
    }
    this.startP2PKit()
  }

  render() {
    let STATE = {}
    let d = '4b1ec958-07d7-41bd-a570-c66d48fc4a7a';
    STATE.PROXIMITY = { a: 1, b: 2, c:3, '4b1ec958-07d7-41bd-a570-c66d48fc4a7a':4}
    console.log('A',STATE.PROXIMITY)
    const { '4b1ec958-07d7-41bd-a570-c66d48fc4a7a': omitted, ...PROXIMITY} = STATE.PROXIMITY;
    console.log('Omitted', omitted)
    console.log('B', PROXIMITY)
    return (
      <View  style= {styles.container}>
        <StatusBar hidden />
        <Header />
      <SetMessage />
      <View style={styles.listContainer}>
        <ScrollView contentContainerStyle={styles.list} >
          <PeerStatusBlockList
            peers={ this.state.discoveredPeers }
            proximity={ this.state.proximity }
          />
        </ScrollView>
      </View>



        <View
          style={styles.button}
        >
        <Button
          onPress={this.toggleProximityFinder.bind(this)}
          title={this.state.finderStatus ? 'Deactivate' : 'Activate'}
        />
        </View>


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
  con: {
    flex:1,
    flexDirection:'row'
  },
  peerBlocks: {
    flex: 3
  },
  peerBlock: {
    height: 30,
    marginTop: 2,
    backgroundColor: 'green'
  },

  panel: {
    flex: 3,
    margin: 10,
  },
  button: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'lightgrey',
    borderWidth: 1,
    alignSelf: 'stretch',
  }

});

AppRegistry.registerComponent('Vista', () => Vista);
