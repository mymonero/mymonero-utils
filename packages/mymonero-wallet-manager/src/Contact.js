'use strict'

class Contact {
  constructor (name, address, type = 'address') {
    this.name = name
    this.address = address
    this.type = type
  }

  /**
   * Returns key paired array of wallet values used for saving
   * @returns {array}
   */
  serialize () {
    const self = this
    return {
      name: self.name,
      address: self.address,
      type: self.type
    }
  }
}

module.exports = Contact
