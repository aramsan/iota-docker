/////////////////////////////////////////////
// Send a zero-value transaction with a "hello world" message
/////////////////////////////////////////////

const Iota = require('@iota/core');
const Converter = require('@iota/converter');
const crypto = require('crypto');

// Connect to a node
const iota = Iota.composeAPI({
    provider: 'http://localhost:14265'
});

const depth = 5;
const minimumWeightMagnitude = 5;
const securityLevel = 2;

const seed = 'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';
const address = 'IRZBQCZFOJXUPJKTEBQJBGQIUBV9EDLIUBEWRAWAQRIU9G9CEJETFO9NLABP9J9FXEUDEQDKPSTPNTJMZ';
var nodes;

setInterval(function () {
    writeToTangle({ "node": iota, "name": "node1", "address": address }, 1);
}, 100);

function preparTransferMessage(address, name, hash) {
    // Define a message to send.
    // This message must include only ASCII characters.
    const date = new Date();
    const now = date.getTime();
    const message = JSON.stringify({ "name": name, "hash": hash, "timestamp": now });

    // Convert the message to trytes
    const messageInTrytes = Converter.asciiToTrytes(message);

    // Define a zero-value transaction object
    // that sends the message to the address
    return [
        {
            "value": 0,
            "address": address,
            "message": messageInTrytes
        }
    ];
}

function writeToTangle(node, index) {
    const name = node.name;
    const targetNode = node.node;
    const address = node.address
    const hash = crypto.createHash('sha512').update(String(index)).digest('hex');

    const transfers = preparTransferMessage(address, name, hash);
    targetNode.prepareTransfers(seed, transfers)
        .then(trytes => {
            return targetNode.sendTrytes(trytes, depth, minimumWeightMagnitude);
        })
        //.then(bundle => {
        //    const bundle_hash = bundle[0].bundle;
        //    console.log(bundle_hash + " <- bundle hash - " + name);
        //})
        .catch(err => {
            console.log(err);
        })
}

async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, ms));
}