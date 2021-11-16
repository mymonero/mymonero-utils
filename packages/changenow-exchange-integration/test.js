var axios = require('axios');
var data = JSON.stringify({
  "from_amount": 1200.24,
  "from_currency": "EUR",
  "to_currency": "BTC",
  "from_network": null,
  "to_network": "BNB",
  "payout_address": "mtXWDB6k5yC5v7TcwKZHB89SUp85yCKshy",
  "payout_extra_id": "1",
  "deposit_type": "SEPA_1",
  "payout_type": "SEPA_1",
  "external_partner_link_id": ""
});

var config = {
  method: 'post',
  url: 'https://api.changenow.io/v2/fiat-transaction',
  headers: { 
    'Content-Type': 'application/json', 
    'x-changenow-api-key': 'your_api_key'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});