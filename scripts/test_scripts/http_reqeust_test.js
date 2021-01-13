const request = require('request');
const crypto = require('crypto');

const API_URL = "http://localhost:4001/api/set";

main();

async function main(){
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const camera_id = 1; // カメラID 
    var frame_number = 0; // 現在のフレーム番号

    setInterval(function() {
        frame_number++;
        var current_hash = createDataHash();
        let body = {
            "camera_id":camera_id,
            "frame_number":frame_number, 
            "hash":current_hash,
        };
        if ((frame_number % 10) == 0) { // テストとして、10フレームためて書き込む。
            body.execute = 1;    
        }
        request.post({url:API_URL, headers:headers, body:JSON.stringify(body)},function(error, response, body){
            console.log(body);
        });
    }, 100);
}

function createDataHash() {
    const date = new Date();
    const now = date.getTime();
    return crypto.createHash('sha256').update(String(now)).digest('hex');
}

function stackHash(previous_hash, current_hash) {
    return crypto.createHash('sha256').update(previous_hash + current_hash).digest('hex');
}