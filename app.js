'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const doenv = require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var favicon = require('serve-favicon')
var path = require('path');
var Wallet = require('./xrp/walletInfo');


//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')))

// view engine
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
   res.send('Hello World');
});

app.get('/walletInfo', (req,res) => {
  res.render(__dirname + '/views/wallet');
})

app.post('/walletInfo', (req,res) => {
  // console.log(req.body.address);
  let address = req.body.address.toString();
  let walletInfoResolver = new Promise(function(resolve,reject){
    Wallet.walletInfoXRP(resolve,address);
  });
  walletInfoResolver.then(function(data){
      console.log(data);
      res.render(__dirname + '/views/index', {data});
  }); 
});

app.get('/payment', (req,res) => {
    res.render(__dirname + '/views/payment');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    var now = new Date();
    console.log(`App is running on Port: ${port} at: ${now}`)
});