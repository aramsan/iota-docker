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
const node1 = Iota.composeAPI({
    provider: 'http://localhost:14266'
});

const node2 = Iota.composeAPI({
    provider: 'http://localhost:14267'
});

const node3 = Iota.composeAPI({
    provider: 'http://localhost:14268'
});

const node4 = Iota.composeAPI({
    provider: 'http://localhost:14269'
});


const depth = 5;
const minimumWeightMagnitude = 5;
const securityLevel = 2;

const seed =
    'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';

main();

async function main() {
    const nodes = await prepareNodeList(seed);
    for (var i = 0; i < 10000; i++) {
        writeToTangle(nodes[0], i);
        writeToTangle(nodes[1], i + 10000);
        writeToTangle(nodes[2], i + 20000);
        writeToTangle(nodes[3], i + 30000);
        writeToTangle(nodes[4], i + 40000);
        await delay(10);
    }
}

async function prepareNodeList(seed) {
    return [
        { "node": iota, "name": "hornet", "address": await getAddress(seed, 0) },
        { "node": node1, "name": "node1", "address": await getAddress(seed, 1) },
        { "node": node2, "name": "node2", "address": await getAddress(seed, 2) },
        { "node": node3, "name": "node3", "address": await getAddress(seed, 3) },
        { "node": node4, "name": "node4", "address": await getAddress(seed, 4) }
    ];
}

async function getAddress(seed, index) {
    addressList = await iota.getNewAddress(seed, { index: index, securityLevel: securityLevel, total: 1 })
    console.log("index:" + index + " address:" + addressList[0]);
    return addressList[0];
}

function preparTransferMessage(address, name, hash) {
    // Define a message to send.
    // This message must include only ASCII characters.
    const date = new Date();
    const now = date.getTime();
    //const now = Math.floor(date.getTime() / 1000);

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