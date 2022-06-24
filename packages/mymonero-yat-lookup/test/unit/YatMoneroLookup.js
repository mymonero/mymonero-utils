const assert = require('assert')
const { it } = require('mocha');
const YatMoneroLookup = require('../../index');
const expect = require("chai").expect;
var instance = new YatMoneroLookup();

describe('Yat MyMonero integration', async function() {
    describe('Check a string to see if it is a valid Yat address', () => {
        it('Should return Boolean true', () => {
            isValidAddress = instance.isValidYatHandle('😀😀😀')
            assert(isValidAddress === true)
            return 
        })
    })

    describe('Retrieve known Yat addresses', () => {
        it('Should return a map of one or two addresses (main + sub)', async () => {
            let getMoneroAddresses = await instance.lookupMoneroAddresses('🦈❤️🍒❗😈')
            assert(getMoneroAddresses instanceof Map)
            return 
        })
    })
    // describe('Check a string to see if it is a valid Yat address', () => {
    //     it('Should return Boolean true', () => {
    //         return true
    //     })
    // })
})