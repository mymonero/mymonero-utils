'use strict';

const axios = require("axios");

function YatMoneroLookup(opts = {}) {
    this.validEmojis = [];
    // this.debugMode denotes whether we use the live or the test API url
    this.debugMode = (opts.debugMode !== undefined) ? opts.debugMode : false;
    // this.remoteLookup determines whether we should retrieve the list of emojis from the Yat server
    this.remoteLookup = (opts.remoteLookup !== undefined) ? opts.remoteLookup : false;
    this.staticEmojiList = ["😂","😇","🙃","😍","😜","😘","🤓","😎","😏","🥺","😢","🤯","😱","🤔","😶","😵","🤐","🤢","🤧","😷","🤕","🤑","🤠","😈","🤡","💩","👻","☠️","👽","👾","🤖","🎃","💪","💋","💄","👂","👃","👣","👁️","👀","🧠","👶","👏","🤝","🙌","👍","👎","✊","✌️","🤘","👌","👉","👋","✍️","🙏","💅","🤳","💃","👕","👖","👗","👙","👘","👠","👢","👞","👟","🎩","🧢","👒","🎓","👑","💍","👛","💼","🎒","🐶","🐱","🐭","🐰","🦊","🐻","🐼","🐮","🐨","🐯","🦁","🐷","🐽","🐸","🐵","🙈","🐔","🐧","🐣","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🕷️","🕸️","🦂","🐢","🐍","🦎","🦖","🐊","🦓","🦍","🦏","🐙","🦀","🐬","🐋","🦈","🐘","🐪","🐃","🐑","🐐","🦌","🦃","🐀","🐾","🐉","🌵","🌲","🌴","🍀","🎋","🍁","🍄","🐚","💐","🌹","🌸","🌻","🌕","🌙","⭐","✨","⚡","☄️","💥","🔥","🌪️","🌈","☀️","☁️","❄️","⛄","💨","💦","🌊","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🍍","🥝","🍆","🥑","🥒","🌶️","🌽","🥕","🥔","🥐","🍞","🧀","🥚","🍳","🥞","🥓","🍗","🌭","🍔","🍟","🍕","🥙","🌮","🌯","🥗","🍝","🍜","🍣","🍱","🍤","🍚","🍘","🍥","🍡","🍦","🎂","🍭","🍬","🍫","🍿","🍩","🍪","🥜","🌰","🍯","🥛","🍼","☕","🍵","🍶","🍺","🍷","🥃","🍸","🍾","🥄","🍽️","⚽","🏀","🏈","⚾","🎾","🏐","🎱","🏓","🏸","🏒","🏏","🥅","⛳","🏹","🎣","🥊","🥋","🎽","⛸️","🎿","🏆","🎖️","🎟️","🎪","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🎻","🎲","♟️","🎯","🎳","🎮","🎰","🚗","🏎️","🚓","🚑","🚒","🚚","🚜","🚲","🛵","🏍️","🚨","🚠","🚂","✈️","💺","🚀","🛸","🚁","🛶","⛵","🚢","⚓","🚧","🚦","🗺️","🗿","🗽","🗼","🏰","🏯","🏟️","🎡","🎢","🎠","🏖️","⛰️","🏕️","🏠","🏭","🏥","🏦","🏛️","⛪","🕌","🕍","🗾","⌚","📱","💻","🖨️","🕹️","💾","📷","🎥","📟","📺","📻","🎛️","⏰","⌛","📡","🔋","🔌","💡","🔦","🕯️","🛢️","💵","💰","💳","💎","⚖️","🔧","🔨","🔩","⚙️","⛓️","🔫","💣","🔪","🗡️","🛡️","🚬","⚰️","🏺","🔮","📿","💈","🔭","🔬","🕳️","💊","💉","🚽","🚰","🚿","🛋️","🔑","🚪","🗄️","📎","📏","📐","📌","✂️","🗑️","🖼️","🛍️","🛒","🎁","🎈","🎏","🎀","🎉","🎎","🏮","🎐","✉️","📦","📜","📈","🗞️","📓","📖","🖍️","✏️","🔒","❤️","💔","✝️","☪️","🕉️","☸️","✡️","🕎","☯️","☦️","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","♾️","⚛️","☢️","🆚","🆘","🚫","🚭","💯","❗","❓","⚠️","🔱","⚜️","♻️","🏧","🆒","🆕","🆓","🆙","🎵","➕","💱","🔔","♠️","♣️","🃏","🀄","🏁"]
    
    // console.log(this);

    this.apiUrl = (this.debugMode == false) ? "https://a.y.at" : "https://api-dev.yat.rocks";
    
    // These properties are functions defined further below in this file
    this.getSupportedEmojis = getSupportedEmojis
    this.isValidYatCharacter = isValidYatCharacter
    this.lookupMoneroAddresses = lookupMoneroAddresses
    this.testEmojisAgainstUnicodePropertyEscape = testEmojisAgainstUnicodePropertyEscape
    this.isValidYatHandle = isValidYatHandle

    
    if (this.remoteLookup == true) {
        this.getSupportedEmojis().then((response) => {
            this.validEmojis = Object.values(response); // properly clone array using spread operator
        })
    } else {
        this.validEmojis = this.staticEmojiList;
    }
    
    this.getBasePath = (() => {
        return this.apiUrl;
    })
}

function isEmojiCharacter(char) {
    return /\p{Emoji}/u.test(char);   
}

function isValidYatHandle(handle) {
    if (typeof(handle) !== 'string') {
        return false;
    }
    // Remember that an emoji is two-bytes in length
    if (handle.length > 10 || handle.length < 1) {
        return false;
    }

    // Iterate through all characters to ensure they're valid emojis 
    for (const c of handle) {
        if (/\p{Extended_Pictographic}/u.test(c) == false) {
            return false
        }
    }
    
    // Iterate through all known valid Yat characters and check that they are members of 
    // This is commented out until it's possible for us to get a full list of emoji mapping
    // for (const c of handle) {
    //     if (this.isValidYatCharacter(c) == false) {
    //         return false
    //     }
    // }

    return true;
}

function getSupportedEmojis() {
    let instance = this;
    return new Promise((resolve, reject) => {
        if (instance.remoteLookup == true) {
            let endpoint = `${instance.apiUrl}/emoji`;
            try {
                axios.get(endpoint)
                    .then((response) => {
                        
                        resolve(response.data);
                    }).catch((error) => {
                        
                        // we could resolve with base emoji list here                        
                        //self.validEmojis = [...validEmojis]; // properly clone array using spread operator
                        resolve(validEmojis);
                    })
            } catch (error) {
                reject(error)
            }
        }
        
        resolve(instance.staticEmojiList)
    })
}


function isValidYatCharacter(char) {
    const self = this;
    let response = self.validEmojis.includes(char);
    return response;
}

// Returns empty object when successful but no data is set. Otherwise, returns object with key => value pair - eg { "0x1001" => "moneroaddress", "0x1002" => "monerosubaddress" }
// *  
function lookupMoneroAddresses(yat) {
    const self = this;
    // 0x1001 is a Monero address, 0x1002 is a Monero subaddress
    let endpointString = `${self.apiUrl}/emoji_id/${yat}?tags=0x1001,0x1002`;
    let endpoint = encodeURI(endpointString);
    return new Promise((resolve, reject) => {
        axios.get(endpoint)
            .then((response) => {
                // This path will execute when a Yat that exists is looked up. 
                let returnData = new Map();
                let resultArray = Object.values(response.data.result);

                resultArray.forEach(function (result) {
                    returnData.set(result.tag, result.data);
                })

                resolve(returnData);

            }).catch(function (error) {
                // We could land up here because a Yat does not exist, or a networking error / server error is encountered -- non-existent Yat handles return a 404
                // Return the error object to the invocator
                reject(error);
            });
    });
}

// This function checks that all returned emoji characters have appropriate properties to be able to parse handles without error. 
// TODO: Refactor into unit test -- if this stops working, it means that the underlying browser / node version does not correctly process regular expressions 
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
// Remember that [0..9], *, #, digits will match true when checking their properties to see if they are 
function testEmojisAgainstUnicodePropertyEscape() {
    let alerted = 0;
    
    let cnt = 0;
    for (let i = 0; i < this.validEmojis.length; i++) {
        let match = isEmojiCharacter(this.validEmojis[i]);
        if (match !== true) {
            alerted++;
        }
        cnt++;
    }
}

module.exports = YatMoneroLookup;
