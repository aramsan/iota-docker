/////////////////////////////////////////////
// Send a zero-value transaction with a "hello world" message
/////////////////////////////////////////////

const Iota = require('@iota/core');
const Converter = require('@iota/converter');
const Extract = require('@iota/extract-json');

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

const depth = 3;
const minimumWeightMagnitude = 5;
const securityLevel = 2;

// Define a seed.
// These do not need to belong to anyone or have IOTA tokens.
// They must only contain a mamximum of 81 trytes
// or 90 trytes with a valid checksum

const seed =
    'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';
var nodes;

main();

async function main() {
    nodes = await prepareNodeList(seed);
    nodes.forEach((node, index) => writeToTangle(node, index));
}

async function prepareNodeList(seed) {
    return [
        { "node": iota, "name": "hornet", "address": await getAddress(seed, 0) },
        { "node": node1, "name": "node1", "address": await getAddress(seed, 1) },
        { "node": node2, "name": "node2", "address": await getAddress(seed, 2) }
    ];
}

async function getAddress(seed, index) {
    addressList = await iota.getNewAddress(seed, { index: index, securityLevel: securityLevel, total: 1 })
    return addressList[0];
}

function preparTransferMessage(address, text) {
    // Define a message to send.
    // This message must include only ASCII characters.
    const message = JSON.stringify({ "message": String(text) });

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

    const transfers = preparTransferMessage(address, name);
    targetNode.prepareTransfers(seed, transfers)
        .then(trytes => {
            return targetNode.sendTrytes(trytes, depth, minimumWeightMagnitude);
        })
        .then(bundle => {
            const bundle_hash = bundle[0].bundle;
            console.log(bundle_hash + " <- bundle hash - " + name);
            readFromTangle(bundle_hash, name);
        })
        .catch(err => {
            console.log(err);
        })
}

function readFromTangle(bundle_hash, writer) {
    nodes.forEach(node => {
        node.node.findTransactionObjects({ bundles: [bundle_hash] })
            .then(transactions => {
                console.log(JSON.parse(Extract.extractJson(transactions)).message + ' <- Written by ' + writer + ' Read from ' + node.name);
            })
            .catch(err => {
                console.log(err);
            });
    });
}