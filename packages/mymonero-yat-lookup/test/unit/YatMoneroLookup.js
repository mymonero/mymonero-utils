const { it } = require('mocha');
const YatMoneroLookup = require('../../index');
const expect = require("chai").expect;
var instance = new YatMoneroLookup();

describe('Yat MyMonero integration', async function() {
    describe('Check a string to see if it is a valid Yat address', () => {
        it('Should return Boolean true', () => {
            let isValidAddress = instance.isValidYatHandle('🦈❤️🍒❗😈')
            console.log(isValidAddress)
            isValidAddress = instance.isValidYatHandle('😀😀😀')
            console.log(isValidAddress)
            isValidAddress = instance.isValidYatHandle('😀😀asd😀')
            console.log(isValidAddress)
            return 
        })
    })

    describe('Retrieve known Yat addresses', () => {
        it('Should return a map of one or two addresses (main + sub)', () => {
            let getMoneroAddresses = instance.lookupMoneroAddresses('🦈❤️🍒❗😈')
            console.log(getMoneroAddresses)
            return 
        })
    })
    // describe('Check a string to see if it is a valid Yat address', () => {
    //     it('Should return Boolean true', () => {
    //         return true
    //     })
    // })
})