'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const doenv = require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var favicon = require('serve-favicon')
var path = require('path')
//private variables

const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233' // Public TEST rippled server
  });

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')))

// view engine
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    api.connect().then(() => {
        const myAddress = process.env.XRPADDRESS ;      
        console.log('getting account info for', myAddress);
        return api.getAccountInfo(myAddress);
      
      }).then(info => {
        console.log(info);
        console.log('getAccountInfo done');
        var data = {
            xrp_address:process.env.XRPADDRESS ,
            balance: info.xrpBalance
          } 
          res.render(__dirname + '/views/index', {data});
      }).then(() => {
        return api.disconnect();
      }).then(() => {
        console.log('done and disconnected.');
      }).catch(console.error);    
});

app.get('/payment', (req,res) => {
    res.render(__dirname + '/views/payment');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    var now = new Date();
    console.log(`App is running on Port: ${port} at: ${now}`)
});