
const ChangeNowIntegration = require('../../ChangeNowIntegration');
const expect = require("chai").expect;
var instance = new ChangeNowIntegration();
// get transaction status
//estimated exchange amount
// List of available currencies
//  -- fixed-rate
//  -- standard
// minimal exchange amount
// exchange range
// estimated exchange amount
// create transaction
// transaction status
// address validation
//const request = require("supertest")(instance.getApiPath());

describe('ChangeNow API integration', async function() {
    describe('Validate cryptocurrency addresses', function() {
        
        describe('Test valid XMR address is reported as valid by ChangeNow', () => {
            it('should return a JSON object in form { result: true, message: null }', () => {
                return instance.validateAddress('xmr', '47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9').then(response => {
                    expect(response.result).to.equal(true)
                    expect(response.message).to.equal(null)
                })
            })
        })

        describe('Test invalid XMR address is reported as invalid by ChangeNow', () => {
            it('should return a JSON object in form { result: true, message: null }', () => {
                return instance.validateAddress('xmr', 'sadfwasdfasf').then(response => {
                    
                    expect(response.result).to.equal(false)
                    expect(response.message).to.not.equal(null)
                })
            })
        })

        describe('Test valid BTC address is reported as valid by ChangeNow', () => {
            it('should return a JSON object in form { result: true, message: null }', () => {
                return instance.validateAddress('btc', '3E6iM3nAY2sAyTqx5gF6nnCvqAUtMyRGEm').then(response => {
                    expect(response.result).to.equal(true)
                    expect(response.message).to.equal(null)
                })
            })
        })
    }) 
    
/*
    response = await instance.validateAddress('btc', '3E6iM3nAY2sAyTqx5gF6nnCvqAUtMyRGEm')
    console.log(response)
    console.log("1 worked")
    // valid XMR address
    response = await instance.validateAddress('xmr', '47pasa5moXNCSyvvip6sY39VFGYymMhVEXpcaZSaP3hAVNbVXpGu5MVZn9ePeotMRFiJuLq2pB6B3Hm7uWYanyJe1yeSbm9')
    console.log(response)
    console.log("2 worked")
    // invalid XMR address
    response = await instance.validateAddress('xmr', '3E6iM3nAY2sAyTqx5gF6nnCvqAUtMyRGEm')
    */ 

    describe('list available currencies -- different flow mechanisms', function() {
        
        describe('using fixed-rate flow', function(done) {
            it('should return a JSON array with an object for each currency', () => {
                return instance.getFixedFlowCurrencies().then(response => {
                    //console.log(response);
                    expect(response).to.be.an('array');
                })
            });
        })

        describe('using standard rate flow', function(done) {
            it('should return a JSON array with an object for each currency', () => {
                return instance.getStandardFlowCurrencies().then(response => {
                    //console.log(response);
                    expect(response).to.be.an('array');
                })
            });
        })

    });

    describe('Return filtered Monero data', function() {
        it('should return a JSON object containing Monero-specific data', () => {
            //this.timeout(5000)
            console.log("try retrieve");
            return instance.retrieveFilteredMoneroCurrencyData().then(response => {
                console.log(response);
                expect(response).to.be.an('object');
                expect(response, 'ChangeNow may have disabled fixed-rate XMR support temporarily').to.have.property('fixedRateParameters');
                expect(response, 'ChangeNow may have disabled standard-rate XMR support temporarily').to.have.property('standardRateParameters');
                //done();
            });
            
            
            // return instance.retrieveFilteredMoneroCurrencyData().then(response => {
            //     console.log(response);
            // })
        })
    })

    describe('get transaction status', function(done) {
        it('should return a JSON array describing the transaction that has the specified transaction id', () => {
            return instance.getTransactionStatus('').then(response => {
                
            })
        })
    })

    describe('get estimated exchange amount', function(done) {

    })

    describe('get minimal exchange amount', function(done) {
        
    })

    describe('get current exchange range for currency', function(done) {
        
    })


});