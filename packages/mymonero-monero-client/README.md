<p align="center">
  <img alt="MyMonero" src="https://user-images.githubusercontent.com/1645428/120083066-8a394a00-c0c6-11eb-9bc5-1ce02784dab3.png">
</p>

<p align="center">
  Repo to manage MyMoneroClient Web Assembly
</p>

> :warning: This project is under heavy development. Expect bugs & breaking changes.

## General dependencies
If you would like to generate the WASM files yourself you will require docker

## Building

1. Clone the repo `git clone https://github.com/mymonero/mymonero-client.git`
1. `cd mymonero-client`
1. `rm -rf build`
1. `rm src/MyMoneroClient_*`
1. `npm run build`

By following these instructions, new WASM library is generated and copied to the src folder

-----

## Usage

### Installation

```bash
npm i @mymonero/mymonero-monero-client
```

### Initialize

Initialize the WABridge class which loads and prepares the WebAssembly.

```js
const WABridge = await require('@mymonero/mymonero-monero-client')({})
```

### Generate Wallet

Creates a new wallet using the Language and Locale and Network Type.

```js
const result = WABridge.generateWallet('en-US', 'MAINNET')
console.log(result)
```

### Derive Seed and Keys from Mnemonic

Provided mnemonic seed phrase it will return the primary address and keys.

```js
const result = WABridge.seedAndKeysFromMnemonic(
  'foxe selfish hum nexus juven dodeg pepp ember biscuti elap jazz vibrate biscui',
  'MAINNET'
)
console.log(result)
```

### Validate Private keys

Used to validate the users keys for accessing the wallet.
Requires the address, private view key and private spend key.

```js
const result = WABridge.isValidKeys(
  '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
  '7bea1907940afdd480eff7c4bcadb478a0fbb626df9e3ed74ae801e18f53e104',
  '4e6d43cd03812b803c6f3206689f5fcc910005fc7e91d50d79b0776dbefcd803',
  '',
  'MAINNET'
)
console.log(result)
```

### Generate Payment ID

Generates a new random short payment ID string. 

```js
const paymentId = WABridge.generatePaymentId()
console.log(paymentId)
```

### Decode an Address

Decodes the address to access primary address and payment ID.

```js
const result = WABridge.decodeAddress(
  '49qwWM9y7j1fvaBK684Y5sMbN8MZ3XwDLcSaqcKwjh5W9kn9qFigPBNBwzdq6TCAm2gKxQWrdZuEZQBMjQodi9cNRHuCbTr',
  'MAINNET'
)
console.log(result)
```

### Compare two Mnemonics

Compares two mnemonic phrases against each other. 

```js
const result = WABridge.compareMnemonics(
  'foxe selfish hum nexus juven dodeg pepp ember biscuti elap jazz vibrate biscui',
  'fox sel hum nex juv dod pep emb bis ela jaz vib bis'
)
console.log(result)
```
### Validate Integrated Address

Checks if the provided address is a integrated address. returns a boolean value.

```js
const result = WABridge.isIntegratedAddress(
  '4L6Gcy9TAHqPVPMnqa5cPtJK25tr7maE7LrJe67vzumiCtWwjDBvYnHZr18wFexJpih71Mxsjv8b7EpQftpB9NjPaL41VrjstLM5WevLZx', 
  'MAINNET'
)
console.log(result)
```

### Validate Subaddress

Checks if the provided address is a subaddress. returns a boolean value.

```js
const result = WABridge.isSubaddress(
  '4L6Gcy9TAHqPVPMnqa5cPtJK25tr7maE7LrJe67vzumiCtWwjDBvYnHZr18wFexJpih71Mxsjv8b7EpQftpB9NjPaL41VrjstLM5WevLZx', 
  'MAINNET'
)
console.log(result)
```

### Generate new Integrated Address

Generate a new intergrated address using address and payment ID.

```js
const result = WABridge.newIntegratedAddress(
  '43zxvpcj5Xv9SEkNXbMCG7LPQStHMpFCQCmkmR4u5nzjWwq5Xkv5VmGgYEsHXg4ja2FGRD5wMWbBVMijDTqmmVqm93wHGkg',
  '07749f00b7e3a2f6',
  'MAINNET'
)
console.log(result)
```

### Extract Address and Keys from Seed

Provided a hexadecimal seed it will return primary address and keys.

```js
const result = WABridge.addressAndKeysFromSeed(
  '9c973aa296b79bbf452781dd3d32ad7f', 
  'MAINNET'
)
console.log(result)
```

### Derive Mnemonic from Seed

Provided a hexadecimal seed it will return a mnemonic seed phrase.

```js
const result = WABridge.mnemonicFromSeed(
  '9c973aa296b79bbf452781dd3d32ad7f',
  'English'
)
console.log(result)
```

### Estimate transaction fee

Calculates an estimated transaction fee. Its based on two outputs being used.
The fees per byte value can be retrieved from the get_unspent_outs MM server call. 

```js
const result = WABridge.estimateTxFee(1, 6000)
console.log(result)
```

### Generate Key Image

Generates key image for an output. returns the key image for the tx public key and output index.

```js
const result = WABridge.generateKeyImage(
      '585d3601bc6f3b63ad041fbb5f301a6239cbc98ec2954ef827d5f81aed59cff9',
      '5925eac0f78c40a79c75a43be68905adeb7b6ae34c1be2dda2b5b417f8099700',
      '1a9fd7ccfa0de91673f5637eb94a67d85b54eae83d1ec9b609689ec846a50fdd',
      '5000f1da72ec13401b6e4cfccdc5e52c9d0b04383fcb32c85f235874c5104e0d',
      0
    )
console.log(result)
```

### Create Transaction

Creates a raw transaction from the options provided. 
This Tx needs to be sent on to the light wallet server for broadcast.

```js
const options = {
    amount:'0.0001',
    recipientAddress: '42ddLnxquN84kpfmEpL8FxdBw32BGuwagXSz6xRSAUA2e7dupTS1FxP3vo1iPBA2doHPwJUpE7WVCMutnfwVMtVAKoaEA8X',
    priority: 1,
    address: '46kDcL7a9uVQojKQWqxqZUg9cKuffJvjYhbjbybxV46oNZm3Pa7qX9YWXC6vjAnyr3NrMFWvGjj7GUNVrQM9itGC5npKFD8',
    privateViewKey: 'f9f3aa647a5cce9ed896936b7f500b6bf87f48d4e092692c07fe824743a2d402',
    publicSpendKey: '872d28c53d4f2c8e532b445a4d4193ea0d9d72b25695dff2b98bfd82e113cc80',
    privateSpendKey: '9efdc2250dcea2babdf2d8463185234e97b0bebdb0bd313134254316b708f40f',
    shouldSweep: false,
    paymentId: '',
    nettype: 'MAINNET',
    unspentOuts: unspentOuts,
    randomOutsCb: function () {
      return {
        amount_outs: [
          { amount: '0', outputs: [] },
          { amount: '0', outputs: [] }
        ]
      }
    }
   }
WABridge.createTransaction(options)
  .then(function (result) {
    console.log(result)
  })
```

-----

## License

See [`LICENSE.txt`](LICENSE.txt) for license.

All source code copyright © 2021 by MyMonero. All rights reserved.