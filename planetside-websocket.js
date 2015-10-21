/**
 * Created by Pepper on 10/18/2015.
 */
var config = require('./config.json');
var EventEmitter = require('events');
var util = require('util');
var WebSocket = require('ws');

var PS2Socket = function () {
    EventEmitter.call(this);
    var self = this;
    this.socket = {};

    function connect() {
        console.log("connect()");
        self.socket = new WebSocket(config.socket_url + config.service_id);

        self.socket.on('open', function () {
            self.emit('socket-open', new Date());
        });

        self.socket.on('message', function (data) {
            var dataObj = JSON.parse(data);
            if (dataObj.service == "event" && dataObj.type == "serviceMessage") {
                self.emit(dataObj.payload.event_name, dataObj.payload);
            }
        });

        self.socket.on('close', function () {
            self.emit('socket-close', new Date());
            setTimeout(connect, config.reconnect_delay);
        });
    }

    connect();
};

util.inherits(PS2Socket, EventEmitter);

PS2Socket.prototype.send = function (message, options, callback) {
    this.socket.send(message, options, callback);
};

module.exports = new PS2Socket();

Object.defineProperty(module.exports, "config", {
    enumerable: true,
    value: config
});