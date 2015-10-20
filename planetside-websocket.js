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
    var socket = new WebSocket(config.url + config.service_id);

    socket.on('open', function () {
        self.emit('socket-open', new Date());
    });

    socket.on('message', function (data) {
        var dataObj = JSON.parse(data);
        if (dataObj.service == "event" && dataObj.type == "serviceMessage") {
            self.emit(dataObj.payload.event_name, dataObj.payload);
        }
    });

    socket.on('close', function () {
        self.emit('socket-close', new Date());
    });
}

util.inherits(PS2Socket, EventEmitter);

module.exports = new PS2Socket();

Object.defineProperty(module.exports, "config", {
    enumerable: true,
    value: config
});