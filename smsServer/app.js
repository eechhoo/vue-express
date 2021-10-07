var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var router = require("./router.js");
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// 开发资源
app.use("/node_modules/",express.static(path.join(__dirname,"./node_modules/")));
app.use(router);
app.listen(3000,function(){
    console.log("running...");
})