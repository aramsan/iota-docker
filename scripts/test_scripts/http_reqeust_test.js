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
    var first_frame_number = 1; // 書き込む最初のフレーム番号
    var frame_number = 0; // 現在のフレーム番号
    var previous_temporary_transction_hash = crypto.createHash('sha256').update("0").digest('hex'); // 次回ブロックチェーンに書き込むまでスタックしていくハッシュ値
    var previous_transaction_hash = previous_temporary_transction_hash; // ブロックチェーンに書き込まれた1つ前のハッシュ値

    setInterval(function() {
        frame_number++;
        var current_hash = createDataHash();
        let temporary_transction_hash = stackHash(previous_temporary_transction_hash, current_hash);// 1つ前のハッシュ値に今回のハッシュ値を重畳する
        if ((frame_number % 10) == 0) { // テストとして、10フレームためて書き込む。
            hash = temporary_transction_hash;
            let body = {
                "camera_id":camera_id,
                "first_frame_number":first_frame_number, 
                "last_frame_number":frame_number, 
                "hash":hash,
                "previous_transaction_hash": previous_transaction_hash,
                "execute": 1,
            };
            request.post({url:API_URL, headers:headers, body:JSON.stringify(body)},function(error, response, body){
                console.log(body);
            });
            // 次の記録のための各パラメーターの準備
            previous_transaction_hash = hash; // 今回登録したハッシュが次のトランザクションで使う1個前のハッシュ値になる
            first_frame_number = frame_number + 1; // 次の書き込みの最初のフレーム番号の設定
        }
        previous_temporary_transction_hash = temporary_transction_hash;// トランザクション最初のハッシュ値は今のフレームのみのハッシュ値を使う
        
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