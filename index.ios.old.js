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

    this.peerTypes = ['Client','Kiosk']

    this.state = {
      switchStatus: true,
      peerType: this.peerTypes[1],
      discoveredPeers: ['2342134-2341234-12341234-2341234','45456-2452345-2345234-23453'],
      finderStatus: false,
      proximity: {'2342134-2341234-12341234-2341234': 2, '45456-2452345-2345234-23453':5},
      text: '',
      message: '',
      discoveryInfo:'',
      counting:false
    }

    this.p2pkitCallback = {
      onException: (exceptionMessage) => {
        console.log(exceptionMessage.message)
      },

      onEnabled: () => {
        console.log('p2pkit is enabled')
        p2pkit.enableProximityRanging()
        const peerType = this.state
        console.log('peer',peerType)
        const data = base64.encode(this.state.peerType)
        console.log('data', data)
        p2pkit.startDiscovery(data, p2pkit.HIGH_PERFORMANCE) //base64 encoded Data (bytes)
        this.setState({finderStatus:true })
      },



      onDisabled: () => {
        const peerID = '4b1ec958-07d7-41bd-a570-c66d48fc4a7a'


        console.log('Pre state', this.state.proximity)
        console.log('ID', peerID)
        const { peerID: omittedField, ...proximity} = this.state.proximity;
        console.log('In between', proximity)
        console.log('Omitted', omittedField)
        this.setState({ proximity, discoveredPeers: [] }, () => {
          console.log('Post State', this.state.proximity)
        })
        this.setState({finderStatus:false })
        console.log('p2pkit is disabled')
      },

      // Refer to platform specific API for error codes
      onError: (errorObject) => {
        console.log('p2pkit failed to enable on platform ' + errorObject.platform + ' with error code ' + errorObject.errorCode)
      },

      onDiscoveryStateChanged: (discoveryStateObject) => {
        console.log('discoveryStateObject', discoveryStateObject)
        console.log('discovery state updated on platform ' + discoveryStateObject.platform + ' with status code ' + discoveryStateObject.state)
      },

      onPeerDiscovered: (peer) => {
        const { peerID, proximityStrength, discoveryInfo } = peer
        const { discoveredPeers, peerType, proximity } = this.state
        // this.setState({ discoveryInfo: base64.decode(discoveryInfo)})
        // let decoded = base64.decode(discoveryInfo)
        // this.setState({discoveryInfo: base64.decode(discoveryInfo)})
        let tempObj = Object.assign({}, proximity)
        tempObj[peerID] = proximityStrength || 0;
        // this.setState({ proximity: tempObj, discoveryInfo: 'base64.decode(discoveryInfo)' })
        console.log('peer discovered blahblah' + peerID)
        console.log('peer discovered blahblah' + discoveryInfo)
        if ( discoveredPeers.indexOf(peerID) < 0 && !discoveryInfo.startsWith(peerType)){
          console.log('PeerType', peerType)
          this.setState({
            proximity: tempObj,
            discoveryInfo: 'base64.decode(discoveryInfo)', // remove string quotes when ready
            discoveredPeers: [...discoveredPeers, peerID]
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
        // this.test = peer.discoveryInfo
        this.setState({ discoveryInfo: peer.discoveryInfo })
        console.log('discovery info updated for peer ' + peer.peerID + ' info ' + peer.discoveryInfo)
      },

      onProximityStrengthChanged: (peer) => {
        const { peerID, proximityStrength } = peer
        let tempObj = this.state.proximity
        tempObj[peerID] = proximityStrength || 0;
        this.setState({ proximity: tempObj })
        console.log('proximity strength changed for peer ' + peerID + ' proximity strength ' + proximityStrength)
      },

      onGetMyPeerId: (reply) => {
        console.log('Reply',reply)
        console.log(reply.myPeerId)
      },

      onGetDiscoveryPowerMode: (reply) => {
      	console.log(reply.discoveryPowerMode)
      }
    }
  }


  startP2PKit = () => {
    console.log('this.p2pkitCallback', this.p2pkitCallback)
    p2pkit.enable('f80a76326b5d4cf69a635ba88780e7fd', this.p2pkitCallback)
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

  onSwitch(){
    const { switchStatus, peerType, message } = this.state
    let newStatus = !switchStatus;

    this.setState({
      switchStatus: newStatus,
      peerType: this.peerTypes[+newStatus]},
      () => {
        let messageWithPeerType = base64.encode(`${peerType}/${message}`);
        if(this.state.finderStatus){
          p2pkit.pushNewDiscoveryInfo(messageWithPeerType)
        }
      })
    }

  onTextChange(text){
    this.setState({text})
  }

  onUpdateButtonPressed(){
    this.setState({message: this.state.text, text: '' }, () =>{
      if(!this.state.counting){
        this.pushDiscoveryInfo.bind(this)
        this.setState({ counting: true })
        this.timer = setTimeout(this.pushDiscoveryInfo.bind(this), 10000)
      }
    })
  }

  pushDiscoveryInfo(){
    const { switchStatus, peerType, message } = this.state
    let messageWithPeerType = base64.encode(`${peerType}/${message}`);
    this.setState({ counting: false})
    p2pkit.pushNewDiscoveryInfo(messageWithPeerType)

    console.log('Here we will push the data', this.state.message)
  }


  render() {
    return (
      <View  style= {styles.container}>
        <StatusBar hidden />
        <Header
          peerType={ this.state.peerType }
          switchType={ this.onSwitch.bind(this) }
          switchStatus={ this.state.switchStatus }
        />
        <SetMessage
          canUpdate={ !this.state.counting }
          onUpdateButtonPressed={ this.onUpdateButtonPressed.bind(this) }
          onTextChange={ this.onTextChange.bind(this) }
          textValue={ this.state.text }
        />
        <PeerStatusBlockList
          peers={ this.state.discoveredPeers }
          proximity={ this.state.proximity }
        />
        <View
          style={styles.messageInfo}
        >
          <Text>{this.state.discoveryInfo && ''}</Text>
        </View>
        <View style={styles.button}>
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
  messageInfo:{
    borderWidth: 5,
    borderColor:'lightblue',
    height: 100,
    margin: 3,
    // marginBottom: 3,
    alignSelf:'stretch'
  },

  peerBlock: {
    height: 30,
    marginTop: 2,
    backgroundColor: 'green'
  },
  button: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'lightgrey',
    borderWidth: 1,
    margin: 3,
    alignSelf: 'stretch',
  }

});

AppRegistry.registerComponent('Vista', () => Vista);





    // let STATE = {}
    // let d = '4b1ec958-07d7-41bd-a570-c66d48fc4a7a';
    // STATE.PROXIMITY = { a: 1, b: 2, c:3, '4b1ec958-07d7-41bd-a570-c66d48fc4a7a':4}
    // console.log('A',STATE.PROXIMITY)
    // const { '4b1ec958-07d7-41bd-a570-c66d48fc4a7a': omitted, ...PROXIMITY} = STATE.PROXIMITY;
    // console.log('Omitted', omitted)
    // console.log('B', PROXIMITY)
    // if(this.state.messagePending){
    //   console.log('Message being sent',this.state.message)
    // }
