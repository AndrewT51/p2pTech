import p2pkit from 'react-native-p2pkit';

export const p2pKitCallbacks = (function(){
  return {
    onException: (exceptionMessage) => {
      console.log(exceptionMessage.message);
    },

    onEnabled: () => {
      console.log('p2pkit is enabled');
      p2pkit.enableProximityRanging();
      const { peerType } = this.state;
      console.log('peer', peerType);
      const data = base64.encode(peerType);
      console.log('data', data);
      p2pkit.startDiscovery(data, p2pkit.HIGH_PERFORMANCE); //base64 encoded Data (bytes)
      this.setState({finderStatus:true });
    },

    onDisabled: () => {
      const peerID = '4b1ec958-07d7-41bd-a570-c66d48fc4a7a';

      console.log('Pre state', this.state.proximity);
      console.log('ID', peerID);
      const { peerID: omittedField, ...proximity} = this.state.proximity;
      console.log('In between', proximity);
      console.log('Omitted', omittedField);
      this.setState({ proximity, discoveredPeers: [] }, () => {
        console.log('Post State', this.state.proximity);
      });
      this.setState({finderStatus:false });
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

    onPeerDiscovered: (peer) => {
      const { peerID, proximityStrength, discoveryInfo } = peer;
      const { discoveredPeers, peerType, proximity } = this.state;
      // this.setState({ discoveryInfo: base64.decode(discoveryInfo)})
      // let decoded = base64.decode(discoveryInfo)
      // this.setState({discoveryInfo: base64.decode(discoveryInfo)})
      let tempObj = Object.assign({}, proximity);
      tempObj[peerID] = proximityStrength || 0;
      // this.setState({ proximity: tempObj, discoveryInfo: 'base64.decode(discoveryInfo)' })
      console.log('peer discovered blahblah' + peerID);
      console.log('peer discovered blahblah' + discoveryInfo);
      if ( discoveredPeers.indexOf(peerID) < 0 && !discoveryInfo.startsWith(peerType)) {
        console.log('PeerType', peerType);
        this.setState({
          proximity: tempObj,
          discoveryInfo: 'base64.decode(discoveryInfo)', // remove string quotes when ready
          discoveredPeers: [ ...discoveredPeers, peerID ]
        });
      }
    },

    onPeerLost: (peer) => {
      const { peerID } = peer;
      console.log('peer lost ' + peerID);

      console.log('Pre state', this.state.proximity);
      console.log('ID', peerID);
      const { peerID: omittedField, ...proximity} = this.state.proximity;
      console.log('In between', proximity);
      this.setState({ proximity }, () => {
        console.log('Post State', this.state.proximity);
      });

      let peerIndex = this.state.discoveredPeers.indexOf(peerID);
      let newPeerArray = this.state.discoveredPeers.slice(0, peerIndex).concat(this.state.discoveredPeers.slice(peerIndex));
      this.setState({ discoveredPeers: newPeerArray});
    },

    onPeerUpdatedDiscoveryInfo: (peer) => {
      // this.test = peer.discoveryInfo
      this.setState({ discoveryInfo: peer.discoveryInfo });
      console.log('discovery info updated for peer ' + peer.peerID + ' info ' + peer.discoveryInfo);
    },

    onProximityStrengthChanged: (peer) => {
      const { peerID, proximityStrength } = peer;
      let tempObj = this.state.proximity;
      tempObj[peerID] = proximityStrength || 0;
      this.setState({ proximity: tempObj });
      console.log('proximity strength changed for peer ' + peerID + ' proximity strength ' + proximityStrength);
    },

    onGetMyPeerId: (reply) => {
      console.log('Reply', reply);
      console.log(reply.myPeerId);
    },

    onGetDiscoveryPowerMode: (reply) => {
      console.log(reply.discoveryPowerMode);
    }
  };

})();