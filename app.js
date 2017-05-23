import React, { Component } from 'react';
import PeerStatusBlockList from './components/lists/PeerStatusBlockList';
import Header from './components/Header';
import SetMessage from './components/SetMessage';
import base64 from 'base-64';
import PouchDB from 'pouchdb-react-native';
import CheckBoxList from './components/lists/CheckBoxList';

import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar
} from 'react-native';
import p2pkit from 'react-native-p2pkit';

let testPeers = {
  '1234-5678': {
    type: 'Kiosk',
    range: 2,
    message: 'A message'
  },
  '5678-5678': {
    type: 'Client',
    range: 4,
    message: 'Another message'
  }
};

// let options = [ 'Bed', 'Breakfast', 'Vegetarian', 'Vegan', 'Nut Allergy', 'Other' ];
let userId = 'test-user-123456';
const localDB = new PouchDB('techspike');
const remoteDB = new PouchDB('https://andrewt51.cloudant.com/techspike');

localDB.sync(remoteDB, {
  live: true,
  retry: true
})
.on('change', (change) => {
  console.log('Hello', change);
})
.on('error', (err) => {
  console.log('Error', err);
});

export default class App extends Component {
  constructor(props){
    super(props);

    this.peerTypes = [ 'Client', 'Kiosk' ];
    this.state = {
      isKiosk: true,
      isActive: false,
      peerType: this.peerTypes[1],
      text: '',
      displayMessage:'',
      message: '',
      counting:false,
      objDiscoveredPeers: testPeers,
      userPrefs: {}
    };

    this.p2pkitCallback = {
      onException: (exceptionMessage) => {
        console.log(exceptionMessage.message);
      },

      onEnabled: () => {
        const { peerType } = this.state;
        const peerData = {
          type: peerType,
          message: this.state.message || ''
        };
        const data = this.encodeDiscoveryInfo(peerData);
        p2pkit.enableProximityRanging();
        p2pkit.startDiscovery(data, p2pkit.HIGH_PERFORMANCE);//base64 encoded Data (bytes)
        this.setState({ isActive:true });
      },

      onDisabled: () => {
        this.setState({ isActive:false, objDiscoveredPeers: {}, displayMessage: '' });
        console.log('p2pkit is disabled');
      },

      // Refer to platform specific API for error codes
      onError: (errorObject) => {
        console.log('p2pkit failed to enable on platform ' + errorObject.platform + ' with error code ' + errorObject.errorCode);
      },

      onDiscoveryStateChanged: (discoveryStateObject) => {
        console.log('discoveryStateObject', discoveryStateObject);
        console.log('discovery state updated on platform ' + discoveryStateObject.platform + ' with status code ' + discoveryStateObject.state);
      },

      onPeerLost: (peer) => {
        const { peerID } = peer;
        this.removeObjectKey(peerID);
      },

      onPeerDiscovered: (peer) => {
        this.updatePeersInfo(peer);
      },

      onPeerUpdatedDiscoveryInfo: (peer) => {
        this.updatePeersInfo(peer);
      },

      onProximityStrengthChanged: (peer) => {
        this.updatePeersInfo(peer);
      },

      onGetMyPeerId: (reply) => {
        console.log('Reply', reply);
        console.log(reply.myPeerId);
      },

      onGetDiscoveryPowerMode: (reply) => {
        console.log(reply.discoveryPowerMode);
      }
    };
  }

  editUserPrefs(newKeyValuePair){
    let userPrefs = {
      userPrefs: Object.assign({}, this.state.userPrefs, newKeyValuePair)
    };
    this.setState( Object.assign({}, this.state, userPrefs ));
    this.onDocSubmit();

  }

  startP2PKit = () => {
    console.log('this.p2pkitCallback', this.p2pkitCallback);
    p2pkit.enable('f80a76326b5d4cf69a635ba88780e7fd', this.p2pkitCallback);
  }

  updatePeersInfo(peer){
    const { peerID, proximityStrength, discoveryInfo } = peer;
    const { objDiscoveredPeers, peerType } = this.state;
    let decodedInfo = this.decodeDiscoveryInfo(discoveryInfo);
    if (decodedInfo) {
      if ( decodedInfo.type == peerType ) return;
      let cloneOfObjDiscoveredPeers = Object.assign({}, objDiscoveredPeers);
      cloneOfObjDiscoveredPeers[peerID] = Object.assign({}, decodedInfo, { range: proximityStrength || 0 });
      this.setState({ objDiscoveredPeers: cloneOfObjDiscoveredPeers});
    }
  }

  toggleActiveStatus(){
    if (this.state.isActive) {
      return p2pkit.disable();
    }
    this.startP2PKit();
  }

  onSwitch(){
    const { isKiosk, peerType, message } = this.state;
    let newStatus = !isKiosk;
    if (this.state.isActive) {
      p2pkit.disable();
    }

    this.setState({
      isActive: false,
      isKiosk: newStatus,
      objectDiscoveredPeers: {},
      peerType: this.peerTypes[+newStatus]},
      () => {
        const codedInfo = this.encodeDiscoveryInfo({
          type: peerType,
          message
        });

        if (this.state.isActive && !this.state.counting) {
          p2pkit.pushNewDiscoveryInfo(codedInfo);
          this.setState({counting: true});
        }
      });
  }

  onTextChange(text){
    this.setState({text});
  }

  onUpdateButtonPressed(){
    this.setState({message: this.state.text, text: '' }, () => {
      if (!this.state.counting && this.state.isActive) {
        this.pushDiscoveryInfo.call(this);
        this.setState({ counting: true });
        this.timer = setTimeout(this.pushDiscoveryInfo.bind(this), 60000);
      }
    });
  }

  removeObjectKey(key){
    let copy = Object.assign({}, this.state.objDiscoveredPeers);
    delete copy[key];
    this.setState({ objDiscoveredPeers: copy });
  }

  pushDiscoveryInfo(){
    const { peerType, message } = this.state;
    const codedInfo = this.encodeDiscoveryInfo({
      type: peerType,
      message: message
    });
    this.setState({ counting: false});
    p2pkit.pushNewDiscoveryInfo(codedInfo);
  }

  onPressPeer(message){
    this.setState({displayMessage: message });
  }

  decodeDiscoveryInfo(binaryInfo){
    let decoded = base64.decode(binaryInfo);
    return JSON.parse(decoded);
  }

  encodeDiscoveryInfo(peerData){
    const stringifiedData = JSON.stringify(peerData);
    return base64.encode(stringifiedData);
  }
/*-----------------------------------------------------------------------------*/
  onDocSubmit(){
    localDB.get(userId)
    .then( doc => {
      localDB.put({
        _id: userId,
        _rev: doc._rev,
        value: this.state.userPrefs
      });
    })
    .catch(err => {
      if (err.name == 'not_found') {
        localDB.put({
          _id: userId,
          value: this.state.userPrefs
        });
      }
    });
  }

  componentDidMount(){

    localDB.changes({
      live: true,
      include_docs: true //Include all fields in the doc field
    }).on('change', this.handleChange.bind(this));
  }

  handleChange(change){
    var doc = change.doc;
    if ( doc.value) {
      this.setState({userPrefs: doc.value});
    }
  }

/*------------------------------------------------------------------------------*/
  renderCheckBoxes(){
    if ( this.state.peerType !== 'Client') { return null; }
    return <CheckBoxList
      userPrefs={ this.state.userPrefs }
      onChange={ this.editUserPrefs.bind(this) }
    />;
  }

  render(){
    return (
      <View style= {styles.container}>
        <StatusBar hidden />
        <Header
          peerType={ this.state.peerType }
          switchType={ this.onSwitch.bind(this) }
          isKiosk={ this.state.isKiosk }
        />
        <SetMessage
          canUpdate={ !this.state.counting }
          onUpdateButtonPressed={ this.onUpdateButtonPressed.bind(this) }
          onTextChange={ this.onTextChange.bind(this) }
          textValue={ this.state.text }
          message = { this.state.message }
        />
        <PeerStatusBlockList
          onPressPeer={ this.onPressPeer.bind(this) }
          peers={ this.state.discoveredPeers }
          proximity={ this.state.proximity }
          objectPeers={this.state.objDiscoveredPeers}
          searchForPeerType={ this.peerTypes[+!this.state.isKiosk]}
        />
        { this.renderCheckBoxes() }
        <View style={styles.messageInfo}>
          <Text style={{fontSize:20}}>{this.state.displayMessage || ''}</Text>
        </View>
        <View style={styles.button}>
          <Button
            onPress={this.toggleActiveStatus.bind(this)}
            title={this.state.isActive ? 'Deactivate' : 'Activate'}
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
    height: 50,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
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
