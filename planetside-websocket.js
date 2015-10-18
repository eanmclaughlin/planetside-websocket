/**
 * Created by Pepper on 10/18/2015.
 */


var config = require('./config.json');
var EventEmitter = require('events');
var util = require('util');
var WebSocket = require('ws');

function PS2Socket() {
    EventEmitter.call(this);
    var self = this;
    var socket = new WebSocket('wss://push.planetside2.com/streaming?environment=ps2&service-id=' + config.service_id);

    socket.on('open', function () {
        console.log(new Date() + " Connected to websocket.");
        socket.send(JSON.stringify(config.default_subscription));
    });

    socket.on('message', function (data) {
        var dataObj = JSON.parse(data);
        if (dataObj.service == "event" && dataObj.type == "serviceMessage") {
            self.emit(dataObj.payload.event_name, dataObj.payload);
        }
    });

    socket.on('close', function () {
        console.log(new Date() + " Disconnected from websocket.");
    });
}

util.inherits(PS2Socket, EventEmitter);

module.exports = PS2Socket;
