<p align="center">
  <img alt="MyMonero" src="https://user-images.githubusercontent.com/1645428/146000939-b06f8fd3-9ed2-4a5e-bdd6-3981281dde9c.png">
</p>

<h1 align="center">MyMonero Wallet Library</h1>

<div align="center">
  <strong>Simple Library Interface for light wallet clients</strong><br>
  A simple and easy-to-use interface library for interacting with MyMonero or Monero lightweight compatible servers.<br>
</div>

> :warning: This project is under heavy development. Expect bugs & breaking changes.

-----
The MyMonero wallet library is an opinionated implementation of a light wallet. It includes using the mymonero-lws-client to connect to compatible light wallet servers for scanning and decoy selection and mymonero-monero-client for wallet generation, key imaging and transaction construction.

## Usage

### Installation

```bash
npm i @mymonero/mymonero-wallet-manager
```

### Initialize

Initialize the WalletManager builder class and load the Monero client libraries. 

```js
const WalletManager = require('@mymonero/mymonero-wallet-manager')
const walletManager = new WalletManager('STAGENET', 'https://stagenet-api.mymonero.rtfm.net')
await walletManager.init()
```

### Generate Wallet

Generates a new mnemonic seed and instantiates the wallet object. The created wallet will need to be registered with the light wallet server using the wallet.login(true) command.

```js
wallet = await walletManager.createWallet('name')
console.log(wallet.serialize())
```

### Import Wallet with the mnemonic seed

Opens existing wallet using the mnemonic seed and instantiates the wallet object. The wallet will need to be registered with the light wallet server using the wallet.login(true) command.

```js
wallet = await walletManager.importWallet('name', 'seed phrase')
console.log(wallet.serialize())
```

### Import Wallet with private keys

It opens the existing wallet using the private keys and instantiates the wallet object. The wallet will need to be registered with the light wallet server using the wallet.login(true) command.

```js
wallet = await walletManager.importWalletKeys(name, address, privateViewKey, privateSpendKey)
console.log(wallet.serialize())
```

### Open Wallet with the saved state

It opens the existing wallet using saved local data. 

```js
const options = {
  name,
  seed,
  mnemonic,
  mnemonicLanguage,
  netType,
  keyImageCache,
  url,
  feePerb,
  address,
  publicViewKey,
  privateViewKey,
  publicSpendKey,
  privateSpendKey,
  startHeight,
  scannedBlockHeight,
  blockHeight,
  scannedTransactionHeight,
  transactionHeight,
  rawTransactions,
  transactions,
  balance,
  balancePending,
  balanceUnlocked,
  cachedTransactions
}
wallet = await walletManager.openWallet(options))
console.log(wallet.serialize())
```

### Login/register on the light wallet server.

Logs in to or registers the wallet with the light wallet server. The primary address and private view key are shared with the server to facilitate scanning the blockchain.

```js
const createAccount = true // defaults to false. Set true for newly created wallets
const result = await wallet.login(createAccount)
console.log(result)
```

### Sync the wallet with the light wallet server.

The Sync function requests the latest transaction list and blockchain details from the light wallet server. To be polled periodically while the wallet is open to keep the light wallet server scanning. Recommended intervals of 30 to 90 seconds. The returned results will be key imaged, and wallet.transactions will be updated.
Syncing recalculates balances based on the transaction data returned.

```js
const transactions = await wallet.sync()
console.log(transactions)
```

### Estimate Transaction fee

Estimates the send fee in piconeros. 1 piconero (0.000000000001 XMR)
Priority is optional and will default to 1.

```js
const priority = 1
const fee = await wallet.estimateFee(priority)
console.log(fee)
```

### Transfer

Send funds to single or multiple destinations.

Single destinations support the following address formats.
- primary address
- primary address with payment id (will be converted to integrated address)
- integrated address
- subaddress

Multiple destinations support any combination of primary addresses and subaddresses.
Multiple destination transfers do not support payment id's.

send_amount is denominated in moneros and not piconeros. 1 piconero (0.000000000001 XMR).
shouldSweep attempts to send all funds to a single destination address. Set send_amount to 0 when sweeping.
priority is a fee multiplier. 1 being the lowest fees and 3 being the max. 99% of scenarios, there is no reason to raise above 1.

Successful transactions will show in the transaction list, returning the transaction id (hash).
This transaction will have no block height while in mempool, waiting to be mined. The wallet.sync() command will return updated transaction details after this. 

```js
const options = {
  destinations: [
    { 
      to_address: '55zEF8bGuQVSSCeg5Bnh5G6CZoJKDLUWE7q91hxABeaJCb9VUpFrKro6np9tuHEG1uMM1st9b2xJDa7pgTBRRkvu7p3Y9U5', 
      send_amount: '0.1' 
    }
  ],
  shouldSweep: false,
  priority: 1
}
const hash = await wallet.transfer(options).catch(err => {
  console.log(err.message)
})
```
### Generate Payment Id

Generates a short payment id consisting of 16 characters. Use short payment id's to create an integrated address.

```js
const shortPaymentId = wallet.generatePaymentId()
console.log(shortPaymentId)
```

### Generate Integrated Address

Generates an integrated address using the address and short payment id. Omit payment id to generate one.

```js
const integratedAddress = wallet.generateIntegratedAddress('46kDcL7a9uVQojKQWqxqZUg9cKuffJvjYhbjbybxV46oNZm3Pa7qX9YWXC6vjAnyr3NrMFWvGjj7GUNVrQM9itGC5npKFD8', '14aadac4ae6bae9f')
console.log(integratedAddress)
```

### Decode Address

Validate an address and determine if it is a subaddress or integrated address.
Invalid addresses will throw an exception.
Determine subaddresses by the property isSubaddress. Subaddresses cannot contain a payment id.
Determine integrated addresses by the property isSubaddress = false and property paymentId != null

```js
const addressResult = wallet.decodeAddress('83iUpSYSEWGhqQ1ungVfNrQYVw556xMbJB1QcZyMrmXAQZQenMjmgTmc8WSwRX1Wxd25sY2WpBPT933MTM3Tti4mETKewsm')
console.log(addressResult)
```

### Serialize Wallet object

Serialize the wallet object for local storage or debugging. Warning! This does include the mnemonic seed and private keys in plain text!

```js
const serialWallet = wallet.serialize()
console.log(serialWallet)
```

### Convert piconeros to moneros

Converts piconero's into monero value.

```js
const moneroAmount = wallet.convertFromPicos(1000000000000)
console.log(moneroAmount)
```

### Retrieve Unspent Outputs
It returns a list of potential unspent outputs from the light wallet server. These outputs require key imaging to determine the actual unspent outputs. No need to call this function in regular wallet operation. Can assist with debugging.

```js
const unspentOutputs = await wallet.unspentOutputs()
console.log(unspentOutputs)
```

### Retrieve Decoys
It returns a list of output decoys from the light wallet server. No need to call this function in regular wallet operation. Can assist with debugging.

```js
const numberOfOutputs = 1
const decoys = await wallet.decoyOutputs(numberOfOutputs)
console.log(decoys)
```
-----
### Fetch Exchange rates

Fetches the latest exchange rates for BTC and fiat currencies paired with XMR.
Supported currencies:
- AUD
- BRL
- BTC
- CAD
- CHF
- CNY
- EUR
- GBP
- HKD
- INR
- JPY
- KRW
- MXN
- NOK
- NZD
- SEK
- SGD
- TRY
- USD
- RUB
- ZAR

```js
const exchangeRates = await walletManager.exchangeRates()
```
-----
## License

See [`LICENSE.txt`](LICENSE.txt) for license.

All source code copyright © 2022 by MyMonero. All rights reserved.