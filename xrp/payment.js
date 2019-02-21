'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const assert = require('assert');


exports.processPayment = function processPayment(RIPPLE_TO_ADDRESS,RIPPLE_FROM_ADDRESS,RIPPLE_FROM_SECRET,AMOUNT,resolve){
            
        // const RIPPLE_FROM_ADDRESS =  'rJtEtaVKUc5NVQ5HZWhRWF7E2L7c2ParKn';
        // const RIPPLE_TO_ADDRESS =  'rnhqJiDfjJupQYgcNt6jrUKTksGwHG63Ut';
        // const RIPPLE_FROM_SECRET =  'sn4tMWFKfU9y6YJ2aeDd78wXkqsBY';

        const api = new RippleAPI({
        server: 'wss://s.altnet.rippletest.net:51233' // XRP Test Net
        });

        run().catch(error => console.error(error.stack));

        async function run() {
        await api.connect();

        // Ripple payments are represented as JavaScript objects
        const payment = {
            source: {
            address: RIPPLE_FROM_ADDRESS,
            maxAmount: {
                value: AMOUNT.toString(),
                currency: 'XRP'
            }
            },
            destination: {
            address: RIPPLE_TO_ADDRESS,
            amount: {
                value: AMOUNT.toString(),
                currency: 'XRP'
            }
            }
        };

        // Get ready to submit the payment
        const prepared = await api.preparePayment(RIPPLE_FROM_ADDRESS, payment, {
            maxLedgerVersionOffset: 5
        });
        // Sign the payment using the sender's secret
        const { signedTransaction } = api.sign(prepared.txJSON, RIPPLE_FROM_SECRET);
        console.log('Signed', signedTransaction)

        // Submit the payment
        const res = await api.submit(signedTransaction);

        resolve(res);
        // process.exit(0);
        }
  }