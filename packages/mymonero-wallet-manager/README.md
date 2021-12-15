<p align="center">
  <img alt="MyMonero" src="https://user-images.githubusercontent.com/1645428/146000939-b06f8fd3-9ed2-4a5e-bdd6-3981281dde9c.png">
</p>

<h1 align="center">MyMonero Wallet Library</h1>

<div align="center">
  <strong>Simple Library Interface for light wallet clients</strong><br>
  A simple and easy to use interface library for interacting with MyMonero or Monero light weight compatible servers.<br>
</div>

> :warning: This project is under heavy development. Expect bugs & breaking changes.

-----

## Usage

### Installation

```bash
npm i @mymonero/mymonero-wallet-manager
```

### Initialize

Initialize the WABridge class which loads and prepares the WebAssembly.

```js
const WalletManager = await require('@mymonero/mymonero-wallet-manager')({})
const walletManager = new WalletManager('STAGENET', 'https://stagenet-api.mymonero.rtfm.net')
await walletManager.init()
```

### Generate Wallet

Creates a new wallet.

```js
wallet = await walletManager.createWallet('name')
console.log(wallet.serialize())
```

### Import Wallet with mnemonic seed

Opens existing wallet and registers it with the light wallet server.

```js
wallet = await walletManager.importWallet('name', 'seed phrase')
console.log(wallet.serialize())
```

### Import Wallet with private keys

Opens existing wallet and registers it with the light wallet server.

```js
wallet = await walletManager.importWalletKeys(name, address, privateViewKey, privateSpendKey)
console.log(wallet.serialize())
```

### Open Wallet with saved state

Opens existing wallet and registers it with the light wallet server.

```js
const options = {}
wallet = await walletManager.openWallet(options))
console.log(wallet.serialize())
```

### Create Wallet

Creates new wallet and registers it with the light wallet server.

```js
wallet = await walletManager.createWallet(name)
console.log(wallet.serialize())
```

### Fetch Exchange rates

Fetches the latest exchange rates for fiat currencies.

```js
const exchangeRates = await walletManager.exchangeRates()
```
-----

### Sync the wallet with the light wallet server.

Syncs transactions and blockchain details from the light wallet server

```js
wallet.sync()
```

### Login / register on the light wallet server.

Logs in to or registers with the light wallet server

```js
wallet.login(address, privateViewKey)
```

### Estimate Transaction fee

Estimates the send fee

```js
wallet.estimateFee()
```

### Transfer

Send funds to a single or multiple destinations

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
-----

## License

See [`LICENSE.txt`](LICENSE.txt) for license.

All source code copyright © 2022 by MyMonero. All rights reserved.