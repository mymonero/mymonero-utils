
const YatMoneroLookup = require('./index');
let yatMoneroLookup = new YatMoneroLookup({ debugMode: true });
console.log(yatMoneroLookup);
console.log(yatMoneroLookup.getBasePath());
console.log("Valid yat?");
setTimeout(() => {

    //yatMoneroLookup.testEmojisAgainstUnicodePropertyEscape(); 

    // Expect true
    console.log(yatMoneroLookup.isValidYatHandle("😂😂😂"))
    
    // Expect true
    console.log(yatMoneroLookup.isValidYatHandle("🐶"))
    console.log(yatMoneroLookup.isValidYatHandle("🐶🐶"))

    // Expect a false
    console.log(yatMoneroLookup.isValidYatHandle("a😃😃😃"))
    
    // expect true
    // yatMoneroLookup.isValidYatCharacter("🔫").then((response) => {
    //     console.log(response);
    // });
    // // // expect false
    // yatMoneroLookup.isValidYatCharacter("😃").then((response) => {
    //     console.log(response);
    // })
    // // // expect false
    // yatMoneroLookup.isValidYatCharacter("😀").then((response) => {
    //     console.log(response);
    // })
    // // // expect false
    // yatMoneroLookup.isValidYatCharacter("😄").then((response) => {
    //     console.log(response);
    // })
    // // // expect false
    // yatMoneroLookup.isValidYatCharacter("😁").then((response) => {
    //     console.log(response);
    // })
    // // yatMoneroLookup.isValidYatHandle("🔫🔫🔫").then((response) => {
    // //     console.log("Is this handle valid?");
    // //     console.log(response);
    // // })
    yatMoneroLookup.lookupMoneroAddresses("😂😂😂").then((response) => {
        console.log(`Result of monero address lookup`);
        console.log(response);
    })

}, 1000);