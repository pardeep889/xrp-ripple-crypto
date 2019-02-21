'use strict';
const doenv = require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var favicon = require('serve-favicon')
var path = require('path');
var WAValidator = require('wallet-address-validator');

var Wallet = require('./xrp/walletInfo');
var Payment = require('./xrp/payment');

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
  let address = req.body.address.toString();
  var valid = WAValidator.validate(address, 'ripple', 'testnet');
    if(valid){
      let walletInfoResolver = new Promise(function(resolve,reject){
        Wallet.walletInfoXRP(resolve,address);
      });
      walletInfoResolver.then(function(data){     
          if(data == 'null'){
            res.send("Error [hint: Please check your address]");
          }else{
             res.render(__dirname + '/views/index', {data});
          }         
      }); 
    }          
    else{
          res.send("Error [hint: Please check your address]");
    }
});

app.get('/payment', (req,res) => {
    res.render(__dirname + '/views/payment');
});

app.post('/payment', (req,res) => {
  let source = req.body.source;
  let dest = req.body.dest;
  let amount= parseInt(req.body.amount);
  let key = req.body.key;
  var validSource = WAValidator.validate(source, 'ripple', 'testnet');
  var validDest = WAValidator.validate(dest,'ripple','testnet'); 

  if(validSource && validDest && typeof(amount) == 'number' && !isNaN(amount)) {
    let processPaymentResolver = new Promise(function(resolve,reject){
      Payment.processPayment(dest,source,key,amount,resolve);
    });
    processPaymentResolver.then((data)=> {
      res.send(data);
    });

  }else{
    res.send("Error [hint: Please check your address or Private Key]");   
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    var now = new Date();
    console.log(`App is running on Port: ${port} at: ${now}`)
});