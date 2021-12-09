<p align="center">
  <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 17.648C0 7.90128 7.43852 0 16.6257 0H133.374C142.556 0 150 7.90602 150 17.648V132.352C150 142.099 142.561 150 133.374 150H16.6257C7.4436 150 0 142.094 0 132.352V17.648Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M35.4404 100.954C35.4404 103.754 37.6404 105.954 40.4404 105.954C43.2404 105.954 45.5071 103.754 45.5071 100.954V77.7544L54.3738 91.4211C55.4404 93.0211 56.7738 94.0211 58.6404 94.0211C60.5071 94.0211 61.8404 93.0211 62.9071 91.4211L71.9071 77.5544V100.821C71.9071 103.621 74.1738 105.954 76.9738 105.954C79.8404 105.954 82.1071 103.688 82.1071 100.821V63.7544C82.1071 60.8878 79.8404 58.6211 76.9738 58.6211H75.8404C73.7738 58.6211 72.3071 59.4878 71.2404 61.2211L58.7738 81.4878L46.3738 61.2878C45.4404 59.7544 43.9071 58.6211 41.7071 58.6211H40.5738C37.7071 58.6211 35.4404 60.8878 35.4404 63.7544V100.954Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M80.9104 100.954V77.7544L89.777 91.4211C90.8437 93.0211 92.177 94.0211 94.0437 94.0211C95.9103 94.0211 97.2437 93.0211 98.3103 91.4211L107.31 77.5544V100.821C107.31 103.621 109.577 105.954 112.377 105.954C115.244 105.954 117.51 103.688 117.51 100.821V63.7544C117.51 60.8878 115.244 58.6211 112.377 58.6211H111.244C109.177 58.6211 107.71 59.4878 106.644 61.2211L94.177 81.4878L81.777 61.2878C80.8437 59.7544 79.3104 58.6211 77.1104 58.6211C77.1104 58.6211 80.9104 103.754 80.9104 100.954Z" fill="white"/>
<path d="M14.0625 23.4375C14.0625 18.2598 18.2598 14.0625 23.4375 14.0625H126.563C131.74 14.0625 135.938 18.2598 135.938 23.4375V23.4375H14.0625V23.4375Z" fill="#00BDF4"/>
</svg>
</p>

<p align="center">
  Repo to manage MyMonero Light Wallet Service API connector
</p>

> :warning: This project is under heavy development. Expect bugs & breaking changes.

-----

## Usage

### Installation

```bash
npm i @mymonero/mymonero-lws-client
```

### Initialize

Initialize the Light Wallet Client.

```js
const axios = require('axios').default
const LWSClient = require('@mymonero/mymonero-lws-client')
const options = {
    httpClient: axios,
    url: 'https://api.mymonero.com',
    appName: 'MyMonero',
    appVersion: '1.1.25'
}
const lwsClient = new LWSClient(options)
```

### Login

Confirms if the the account is on the MyMonero servers.
if the create parameter is true it will add the wallet to the MyMonero servers.

```js
const privateViewKey = '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104'
const address = '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
const addAccount = true
const result = await lwsClient.login(
  privateViewKey,
  address,
  true
)
console.log(result)
```

Example Response

```json
{
    "new_address": true,
    "start_height": 0
}
```

### Get Addresses Transactions

Fetches all the transactions associated with the address.
This includes decoys. The decoys can be removed by using the generateKeyImage function in the mymonero-client repo. 

```js
const privateViewKey = '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104'
const address = '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
const result = await lwsClient.getAddressTxs(
  privateViewKey,
  address
)
console.log(result)
```

Example Response
```json
{
    "transactions": [
        {
            "hash": "db58a141d1f29e0c9c43ab4016805a214386591b1699f1b16f56d330e59abf6a",
            "id": 17862204,
            "timestamp": "2021-08-03T10:27:35Z",
            "total_received": "10000000000",
            "total_sent": "0",
            "unlock_time": 0,
            "height": 2418938,
            "coinbase": false,
            "mempool": false,
            "mixin": 10
        },
        {
            "hash": "5486052ec89d85a597379ac843be59c1e0f3f67bec996c97a13de2d5b0a468fc",
            "id": 17868342,
            "timestamp": "2021-08-03T14:55:09Z",
            "total_received": "0",
            "total_sent": "10000000000",
            "fee": "43483770000",
            "unlock_time": 0,
            "height": 2419038,
            "coinbase": false,
            "mempool": false,
            "mixin": 10,
            "spent_outputs": [
                {
                    "tx_pub_key": "585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9",
                    "key_image": "d77a7e53417a11110138290dd6be8df3709d4815016eda88fcd2722dfd083666",
                    "amount": "10000000000",
                    "out_index": 1,
                    "mixin": 10
                }
            ]
        }
    ],
    "total_received": "10000000000",
    "scanned_height": 18301331,
    "scanned_block_height": 2429062,
    "start_height": 0,
    "transaction_height": 18324649,
    "blockchain_height": 2429625
}
```

### Fetch Addresses Unspent Outputs

Fetches all outputs available. They will need to be key imaged to work out which have been spent.
This function also returns the fee per byte and fee mask for calculating the transaction fees.  

```js
const privateViewKey = '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104'
const address = '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
const result = await lwsClient.unspentOutputs(
  privateViewKey,
  address
)
console.log(result)
```

Example Response
```json
{
    "amount": "10000000000",
    "outputs": [
        {
            "amount": "10000000000",
            "public_key": "b155970fc6ba59a45292e2441dba05c1f7a9c5b7a9bf2b740ad506ebca63d849",
            "index": 1,
            "global_index": 36462743,
            "rct": "da0d240d02bc9cbbcfaf86b216248f7828b5a03ba67e594e67a75b925a67a57b75b111ee6ac33d99",
            "tx_id": 17862204,
            "tx_hash": "db58a141d1f29e0c9c43ab4016805a214386591b1699f1b16f56d330e59abf6a",
            "tx_pub_key": "585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9",
            "tx_prefix_hash": "c737a8b9de9c26854ff1753a70e9adad629dbdb4c2ff3c5bde37b566479b09f5",
            "spend_key_images": [
                "d77a7e53417a11110138290dd6be8df3709d4815016eda88fcd2722dfd083666",
                "8602033b812d0586b34cf4fb430c01360d313d64faab8ce4a0414434ea5c213c",
                "cbbad7da43d5ff9c51e3bc2c60c53abfad9d7d32acff8d352f8e3f58c19032f4",
                "d7df16cecab36d74ade484ec08506cba8cc0b1d3e1e7d3f3fd2994b60f2eb0ee",
                "62d2a17a7166a353c0246e18c741831ad108c40fc5b2582a2aeb04fd78f9e25d"
            ],
            "height": 2418938,
            "timestamp": "2021-08-18T06:22:09Z"
        }
    ],
    "per_byte_fee": 5993,
    "fee_mask": 10000,
    "fork_version": 14
}
```

### Fetches decoy mixin outputs

Fetches decoys for the number of required outputs.

```js
const numberOfOutputs = 2
const result = await lwsClient.randomOutputs(numberOfOutputs)
console.log(result)
```

Example Response
```json
{
    "amount_outs": [
        {
            "amount": "0",
            "outputs": [
                {
                    "global_index": "36366289",
                    "public_key": "6965bee02aa3ff532defc5c8606091a95ab3afffea59a2678e3a922eea7fc479",
                    "rct": "b6371b3c730e7b5f0a1420c5d1922c9b9201c39421a33aece82d5ba4e994c698"
                },
                {
                    "global_index": "37519665",
                    "public_key": "e8504b73dca7fe73307183e32f443b8a5f3b7730799c6aa11b58ff37bcb8e623",
                    "rct": "1e02dbfc896c7ed218d954178d190641a2e73b212b22e249d9267b50c8933390"
                },
                {
                    "global_index": "37520147",
                    "public_key": "72506b0134fbdc644bc1a4e9270d192f56e3a3b888168b056ddfbc1863545ddc",
                    "rct": "f41031231b821487eda43533b97df15b634a73af233867e685d03f51408b9656"
                }
            ]
        }
    ]
}
```
### Submit Transaction

Sends the Raw transaction to the server to broadcast to the network.

```js
const tx = '02000102000bc7a1c704e.............343359c302e5'
const result = await lwsClient.submitRawTx(tx)
console.log(result)
```

### Exchange Rates

Fetches the latest exchange rates from the server.

```js
const result = await lwsClient.exchangeRates()
console.log(result)
```

Example Response
```json
{
    "AUD": 353.3,
    "BRL": 1375.62,
    "BTC": 0.005675,
    "CAD": 323.61,
    "CHF": 234.96,
    "CNY": 1619.55,
    "EUR": 219.79,
    "GBP": 186.63,
    "HKD": 2002.7,
    "INR": 21752.24,
    "JPY": 28130.07,
    "KRW": 302286.12,
    "MXN": 5171.11,
    "NOK": 2031.77,
    "NZD": 371.74,
    "SEK": 2591.29,
    "SGD": 349.33,
    "TRY": 2196.06,
    "USD": 257.44,
    "RUB": 18453.98,
    "ZAR": 3947.61
}
```
### Get Address info

Should no longer be used. Returns almost all the same info as the getAddressTxs call but included the exchange rates. The exchange rates can now be called via exchangeRates API call.

```js
const privateViewKey = '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104'
const address = '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg'
const result = await lwsClient.getAddressInfo(
  privateViewKey,
  address
)
console.log(result)
```

-----

## License

See [`LICENSE.txt`](LICENSE.txt) for license.

All source code copyright © 2021 by MyMonero. All rights reserved.