'use strict'
const Contact = require('./Contact')

class ContactManager {
  constructor () {
    this.contacts = []
  }

  /**
   * Creates a new contact.
   * @param {string} name
   * @param {string} value
   * @param {string} type
   * @returns {Contact}
   */
  createContact (name, value, type) {
    const self = this
    const contact = new Contact(name, value, type)
    self.contacts.push(contact)
    return contact
  }

  /**
   * Loads the contacts in to Contact Objects.
   * @param {array} contacts - Contacts array to be turned in to Contact objects.
   */
  loadContacts (contacts) {
    const self = this
    for (let i = 0; i < contacts.length; i++) {
      self.createContact(contacts[i].name, contacts[i].address, contacts[i].type)
    }
  }

  /**
   * Returns key paired array of contacts used for saving.
   * @returns {array}
   */
  serializeContacts () {
    const result = []
    const self = this
    for (let i = 0; i < self.contacts.length; i++) {
      result.push(self.contacts[i].serialize())
    }
    return result
  }
}

module.exports = ContactManager
