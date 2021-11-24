'use strict'

const axios = require('axios').default

/**
 * Lite Wallet Service Client module.
 */
class OpenAlias {
  /**
   *
   * @param {object} options
   * @param {object} [options.httpClient] - Currently only supports axios.
   * @param {string} [options.url] - The cloudflare dns compatible server uri.
   */
  constructor (options = {}) {
    this.httpClient = options.httpClient || axios
    axios.defaults.baseURL = options.url || 'https://cloudflare-dns.com'
  }

  /**
   * Fetches all open alias addresses assigned to the domain.
   * @param {string} oaAddress - open alias address.
   * @returns {object} List of address objects.
   */
  async lookup (oaAddress) {
    const response = await this.httpClient.get('/dns-query', {
      params: {
        name: oaAddress,
        type: 'TXT' },
      headers: {
        'accept': 'application/dns-json'
      }
    }).catch(err => {
      if (err.response === undefined) {
        throw new Error('no response')
      }
    })
    if (response.data.Answer == null) {
      throw new Error('no records found')
    }

    let oaArray = []
    response.data.Answer.forEach(entry => {
      if (entry.data.includes('oa1:')) {
        let addressObj = {}
        let addressSpaceItems = entry.data.split(' ')
        addressObj.currency = addressSpaceItems[0].split(':')[1]
        entry.data = entry.data.replace(addressSpaceItems[0], '')
        let addressItems = entry.data.split(';')
        addressItems.forEach(item => {
          if (item.includes('recipient_address=')) {
            addressObj.address = item.replace('recipient_address=', '').trim()
          }
          if (item.includes('recipient_name=')) {
            addressObj.name = item.replace('recipient_name=', '').trim()
          }
          if (item.includes('tx_description=')) {
            addressObj.description = item.replace('tx_description=', '').trim()
          }
        })

        oaArray.push(addressObj)
      }
    })

    return oaArray
  }
}

module.exports = OpenAlias
