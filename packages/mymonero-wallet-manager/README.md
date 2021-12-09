<p align="center">
  <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 17.648C0 7.90128 7.43852 0 16.6257 0H133.374C142.556 0 150 7.90602 150 17.648V132.352C150 142.099 142.561 150 133.374 150H16.6257C7.4436 150 0 142.094 0 132.352V17.648Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M35.4404 100.954C35.4404 103.754 37.6404 105.954 40.4404 105.954C43.2404 105.954 45.5071 103.754 45.5071 100.954V77.7544L54.3738 91.4211C55.4404 93.0211 56.7738 94.0211 58.6404 94.0211C60.5071 94.0211 61.8404 93.0211 62.9071 91.4211L71.9071 77.5544V100.821C71.9071 103.621 74.1738 105.954 76.9738 105.954C79.8404 105.954 82.1071 103.688 82.1071 100.821V63.7544C82.1071 60.8878 79.8404 58.6211 76.9738 58.6211H75.8404C73.7738 58.6211 72.3071 59.4878 71.2404 61.2211L58.7738 81.4878L46.3738 61.2878C45.4404 59.7544 43.9071 58.6211 41.7071 58.6211H40.5738C37.7071 58.6211 35.4404 60.8878 35.4404 63.7544V100.954Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M80.9104 100.954V77.7544L89.777 91.4211C90.8437 93.0211 92.177 94.0211 94.0437 94.0211C95.9103 94.0211 97.2437 93.0211 98.3103 91.4211L107.31 77.5544V100.821C107.31 103.621 109.577 105.954 112.377 105.954C115.244 105.954 117.51 103.688 117.51 100.821V63.7544C117.51 60.8878 115.244 58.6211 112.377 58.6211H111.244C109.177 58.6211 107.71 59.4878 106.644 61.2211L94.177 81.4878L81.777 61.2878C80.8437 59.7544 79.3104 58.6211 77.1104 58.6211C77.1104 58.6211 80.9104 103.754 80.9104 100.954Z" fill="white"/>
<path d="M14.0625 23.4375C14.0625 18.2598 18.2598 14.0625 23.4375 14.0625H126.563C131.74 14.0625 135.938 18.2598 135.938 23.4375V23.4375H14.0625V23.4375Z" fill="#00BDF4"/>
</svg>

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