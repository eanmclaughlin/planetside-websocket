/**
 * Created by Pepper on 10/18/2015.
 */


var config = require('./config.json');
var WebSocket = require('ws');
var socket = new WebSocket('wss://push.planetside2.com/streaming?environment=ps2&service-id=' + config.service_id);

socket.on('open', function () {
    console.log(new Date() + " Connected to websocket.");
    socket.send(JSON.stringify(config.default_subscription));
});

socket.on('message', function (data) {
    var dataObj = JSON.parse(data);
    if (dataObj.service == "event" && dataObj.type == "serviceMessage") {
        console.log(dataObj.payload);
    }
});

socket.on('close', function () {
    console.log(new Date() + " Disconnected from websocket.");
});