'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
    server: process.env.server// Public TEST rippled server
  });

exports.walletInfoXRP = function walletInfoXRP(resolve,address){
        // console.log(`${address},${secret}`);
        api.connect().then(() => {
        const myAddress = address ;      
        console.log('getting account info for', myAddress);
        return api.getAccountInfo(myAddress);      
      }).then(info => {
        // console.log(info);
        console.log('getAccountInfo done');
         var data = {
            xrp_address:address ,
            balance: info.xrpBalance
          }        
          if(data.balance){
            resolve(data)
          }  
      }).then(() => {
        return api.disconnect();
      }).then(() => {
        console.log('done and disconnected.');
      }).catch( err => {
          resolve("null");
        }
      );
}