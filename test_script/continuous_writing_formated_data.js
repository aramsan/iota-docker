/////////////////////////////////////////////
// Send a zero-value transaction with a "hello world" message
/////////////////////////////////////////////

const Iota = require('@iota/core');
const Converter = require('@iota/converter');
const crypto = require('crypto');

const secureRandom = require("secure-random");
const ec = require("elliptic").ec;
const ecdsa = new ec("secp256k1");

// Connect to a node
const iota = Iota.composeAPI({
    provider: 'http://localhost:14265'
});

const depth = 5;
const minimumWeightMagnitude = 5;
const securityLevel = 2;

const seed = 'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';

main();

async function main(){
    //const address = 'IRZBQCZFOJXUPJKTEBQJBGQIUBV9EDLIUBEWRAWAQRIU9G9CEJETFO9NLABP9J9FXEUDEQDKPSTPNTJMZ';
    var nodes;

    var counter = 0;
    var seq_id = 0;
    var frame_id = 0;
    var camera_id = 1;
    var start_frame_mumber = 1;
    var previous_temporary_transction_hash = 0;
    var previous_transaction_hash = 0;


    var keypair = createKeyPair()
    console.log(keypair);

    /*
    //hashの検証方法
    console.log(verifySignature(hash, keypair.publicKey, signature ));
    */

    setInterval(async function() {
        counter++;
        frame_id++;
        let current_hash = createDataHash();
        let temporary_transction_hash = StackHash(previous_temporary_transction_hash, current_hash);
        //*
        console.log("---------------------");
        console.log(counter);
        console.log(previous_temporary_transction_hash);
        console.log(current_hash);
        console.log(temporary_transction_hash);
        console.log("---------------------");
        //*/
        if ((counter % 3) == 0) {
            let hash = temporary_transction_hash;
            seq_id++;
            let signature = createSignature(hash, keypair.privateKey );
            let data = {
                "seq_id": seq_id,
                "camera_id": camera_id,
                "first_frame_number": start_frame_mumber,
                "last_frame_number": counter,
                "previous_transaction_hash": previous_transaction_hash, 
                "hash": hash,
                "signature": signature,
                "camera_public_key": keypair.publicKey
            };
            console.log(data);
            var address = await getAddress(seed, seq_id);
            console.log('addressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddress');
            console.log(address);
            console.log('addressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddressaddress');
            writeToTangle({"node": iota, "address":address, "data": data});
            // 次の記録のための各パラメーターの準備
            start_frame_mumber = counter + 1;
            previous_transaction_hash = hash; // 今回登録したハッシュが次のトランザクションで使う1個前のハッシュ値になる
        }
        previous_temporary_transction_hash = temporary_transction_hash;// トランザクション最初のハッシュ値は今のフレームのみのハッシュ値を使う
    }, 33);
}

function StackHash(previous_hash, current_hash) {
    return crypto.createHash('sha256').update(previous_hash + current_hash).digest('hex');
}

function createDataHash() {
    const date = new Date();
    const now = date.getTime();
    return crypto.createHash('sha256').update(String(now)).digest('hex');
}

function preparTransferMessage(address, data) {
    // Define a message to send.
    // This message must include only ASCII characters.
    const message = JSON.stringify(data);

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

function writeToTangle(payload) {
    const targetNode = payload.node;
    const address = payload.address;

    const transfers = preparTransferMessage(address, payload.data);
    targetNode.prepareTransfers(seed, transfers)
        .then(trytes => {
            return targetNode.sendTrytes(trytes, depth, minimumWeightMagnitude);
        })
        .then(bundle => {
            const bundle_hash = bundle[0].hash;// このハッシュ値をデータベースに書き込む
            console.log(bundle_hash + " <- transaction hash- " + payload.data.seq_id);
        })
        .catch(err => {
            console.log(err);
        })
}

async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, ms));
}

function getAddress(seed, index) {
    let newAddress = await iota.getNewAddress(seed, { index: index, securityLevel: securityLevel, total: 1 });
    return newAddress[0];
}

function createKeyPair() {
    const max = Buffer.from(
        "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140",
        "hex"
    );
    let isInvalid = true;
    let privateKey;

    while (isInvalid) {
        let privateKeySeed = secureRandom.randomBuffer(32);
        if (Buffer.compare(max, privateKeySeed) === 1) {
            isInvalid = false;
        }
        privateKey = privateKeySeed.toString("hex");
    }

    const keys = ecdsa.keyFromPrivate(privateKey);
    const publicKey = keys.getPublic("hex");

    return ({"privateKey":privateKey, "publicKey":publicKey});
}

function createSignature(message, privateKey) {
    const privateKeyPair = ecdsa.keyFromPrivate(privateKey);
    const signature = ecdsa.sign(message, privateKeyPair).toDER('hex'); //ハッシュされたメッセージに対して秘密鍵で電子署名する。
    return signature;
}

function verifySignature(message, publicKey, signature) {
    const publicKeyPair = ecdsa.keyFromPublic(publicKey, 'hex'); // 公開鍵で電子署名の真正を確認。
    const isVerified = publicKeyPair.verify(message, signature);
    return isVerified;
}