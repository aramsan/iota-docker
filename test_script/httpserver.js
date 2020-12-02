const express = require("express");
const app = express();

/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/
var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

/* 3. 以後、アプリケーション固有の処理 */

// test API
app.get("/api/test", function(req, res, next){
    res.json({"result": "OK"});
});