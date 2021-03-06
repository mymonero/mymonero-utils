
const YatMoneroLookup = require('./index');
let yatMoneroLookup = new YatMoneroLookup({ debugMode: true });
console.log(yatMoneroLookup);
console.log(yatMoneroLookup.getBasePath());
console.log("Valid yat?");
setTimeout(() => {

    //yatMoneroLookup.testEmojisAgainstUnicodePropertyEscape(); 

    // Expect true
    console.log(yatMoneroLookup.isValidYatHandle("πππ"))
    
    // Expect true
    console.log(yatMoneroLookup.isValidYatHandle("πΆ"))
    console.log(yatMoneroLookup.isValidYatHandle("πΆπΆ"))

    // Expect a false
    console.log(yatMoneroLookup.isValidYatHandle("aπππ"))
    
    // expect true
    // yatMoneroLookup.isValidYatCharacter("π«").then((response) => {
    //     console.log(response);
    // });
    // // // expect false
    // yatMoneroLookup.isValidYatCharacter("π").then((response) => {
    //     console.log(response);
    // })
    // // // expect false
    // yatMoneroLookup.isValidYatCharacter("π").then((response) => {
    //     console.log(response);
    // })
    // // // expect false
    // yatMoneroLookup.isValidYatCharacter("π").then((response) => {
    //     console.log(response);
    // })
    // // // expect false
    // yatMoneroLookup.isValidYatCharacter("π").then((response) => {
    //     console.log(response);
    // })
    // // yatMoneroLookup.isValidYatHandle("π«π«π«").then((response) => {
    // //     console.log("Is this handle valid?");
    // //     console.log(response);
    // // })
    yatMoneroLookup.lookupMoneroAddresses("πππ").then((response) => {
        console.log(`Result of monero address lookup`);
        console.log(response);
    })

}, 1000);