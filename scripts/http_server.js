//EXPRESS関連
const express = require("express");
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const app = express();
app.use(bodyParser.json());

//IOTA関連
const Iota = require('@iota/core');
const Converter = require('@iota/converter');
const crypto = require('crypto');

const secureRandom = require("secure-random");
const ec = require("elliptic").ec;
const ecdsa = new ec("secp256k1");

const iota = Iota.composeAPI({
    provider: 'http://localhost:14265'
});

const depth = 5;
const minimumWeightMagnitude = 5;
const securityLevel = 2;

const seed = 'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';
var address;
getAddress(seed, 1).then(function(ret_address){
    address = ret_address;
});
const keypair = createKeyPair();

var temporary_transction_data = {}; // 書き込む最初のフレーム番号

/*
var first_frame_number = 1; // 書き込む最初のフレーム番号
var previous_temporary_transction_hash = crypto.createHash('sha256').update("0").digest('hex'); // 次回ブロックチェーンに書き込むまでスタックしていくハッシュ値
var previous_transaction_hash = previous_temporary_transction_hash; // ブロックチェーンに書き込まれた1つ前のハッシュ値
*/

/* 2. listen()メソッドを実行して4001番ポートで待ち受け。*/
var server = app.listen(4001, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

/* 3. 以後、アプリケーション固有の処理 */
// write API
app.post("/api/set", [
    check('camera_id').isInt(),
    check('frame_number').isInt(),
    check('hash').isHash('sha256'),
],function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    var ret = {};
    if (!temporary_transction_data[req.body.camera_id]) {
        temporary_transction_data[req.body.camera_id] = {
            "first_frame_number":1, // 書き込む最初のフレーム番号
            "previous_temporary_transction_hash":crypto.createHash('sha256').update("0").digest('hex'), // 次回ブロックチェーンに書き込むまでスタックしていくハッシュ値
            "previous_transaction_hash":crypto.createHash('sha256').update("0").digest('hex'),
            "keypair":createKeyPair()
        }
    }
    let temporary_transction_hash = stackHash(temporary_transction_data[req.body.camera_id].previous_temporary_transction_hash, req.body.hash);// 1つ前のハッシュ値に今回のハッシュ値を重畳する
    if(req.body.execute) {
        const hash = temporary_transction_hash;
        const signature = createSignature(hash, temporary_transction_data[req.body.camera_id].keypair.privateKey );// ハッシュ値に署名をつける
        const data = {
            "camera_id": req.body.camera_id,
            "first_frame_number": temporary_transction_data[req.body.camera_id].first_frame_number,
            "last_frame_number": req.body.frame_number,
            "previous_transaction_hash": temporary_transction_data[req.body.camera_id].previous_transaction_hash, 
            "hash": hash,
            "signature": signature,
            "camera_public_key": temporary_transction_data[req.body.camera_id].keypair.publicKey
        };
        console.log(data);
        writeToTangle({"node": iota, "address":address, "data": data});
        // 次の記録のための各パラメーターの準備
        temporary_transction_data[req.body.camera_id].previous_transaction_hash = hash; // 今回登録したハッシュが次のトランザクションで使う1個前のハッシュ値になる
        temporary_transction_data[req.body.camera_id].first_frame_number = req.body.frame_number + 1; // 次の書き込みの最初のフレーム番号の設定
    }
    temporary_transction_data[req.body.camera_id].previous_temporary_transction_hash = temporary_transction_hash;// トランザクション最初のハッシュ値は今のフレームのみのハッシュ値を使う

    const date = new Date();
    const now = date.getTime();
    ret.resutl = "OK";
    ret.timestamp = String(now);
    res.json(ret);
});

// test API
app.get("/api/test", function(req, res, next){
    res.json({"result": "OK"});
});

// IOTA関連関数
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
            console.log(bundle_hash + " <- transaction hash- " + payload.data.frame_num);
        })
        .catch(err => {
            console.log(err);
        })
}

async function getAddress(seed, index) {
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

function stackHash(previous_hash, current_hash) {
    return crypto.createHash('sha256').update(previous_hash + current_hash).digest('hex');
}