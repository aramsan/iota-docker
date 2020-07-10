/////////////////////////////////////////////
// Send a zero-value transaction with a "hello world" message
/////////////////////////////////////////////

const Iota = require('@iota/core');
const Converter = require('@iota/converter');

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

// Define a seed and an address.
// These do not need to belong to anyone or have IOTA tokens.
// They must only contain a mamximum of 81 trytes
// or 90 trytes with a valid checksum
const address =
    'HEQLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWOR99D';
const seed =
    'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';

// Define a message to send.
// This message must include only ASCII characters.
const message = JSON.stringify({ "message": "Hello world" });

// Convert the message to trytes
const messageInTrytes = Converter.asciiToTrytes(message);

// Define a zero-value transaction object
// that sends the message to the address
const transfers = [
    {
        value: 0,
        address: address,
        message: messageInTrytes
    }
];

// Create a bundle from the `transfers` array
// and send the transaction to the node
iota
    .prepareTransfers(seed, transfers)
    .then(trytes => {
        return iota.sendTrytes(trytes, depth, minimumWeightMagnitude);
    })
    .then(bundle => {
        console.log("hornet");
        console.log(bundle[0].hash);
    })
    .catch(err => {
        console.log("hornet");
        console.error(err);
    });

node1
    .prepareTransfers(seed, transfers)
    .then(trytes => {
        return iota.sendTrytes(trytes, depth, minimumWeightMagnitude);
    })
    .then(bundle => {
        console.log("node1");
        console.log(bundle[0].hash);
    })
    .catch(err => {
        console.log("node1");
        console.error(err);
    });

node2
    .prepareTransfers(seed, transfers)
    .then(trytes => {
        return iota.sendTrytes(trytes, depth, minimumWeightMagnitude);
    })
    .then(bundle => {
        console.log("node2");
        console.log(bundle[0].hash);
    })
    .catch(err => {
        console.log("node2");
        console.error(err);
    });