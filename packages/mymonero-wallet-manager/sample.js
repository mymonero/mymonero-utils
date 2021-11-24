const WalletManager = require('./src/WalletManager')

async function init () {
  const walletManager = new WalletManager('STAGENET', 'https://stagenet-api.mymonero.rtfm.net')
  await walletManager.init()
}

init()
