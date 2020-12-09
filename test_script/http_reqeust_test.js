const request = require('request');
const crypto = require('crypto');

const API_URL = "http://localhost:3000/api/set";

main();

async function main(){
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const camera_id = 1;
    var frame_number = 0;
    var seq_id =0;

    setInterval(function() {
        seq_id++;
        frame_number++;
        let body = {
            "hash":createDataHash(), 
            "seq_id":seq_id, 
            "camera_id":camera_id, 
            "frame_number":frame_number, 
        };

        if ((seq_id % 3) == 0) { body.execute = 1; }

        request.post({url:API_URL, headers:headers, body:JSON.stringify(body)},function(error, response, body){
            console.log(body);
        });
    }, 33);
}

function createDataHash() {
    const date = new Date();
    const now = date.getTime();
    return crypto.createHash('sha256').update(String(now)).digest('hex');
}