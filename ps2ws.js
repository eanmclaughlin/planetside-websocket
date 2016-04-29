/**
 * Created by Pepper on 10/18/2015.
 */

process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var config = require('./config/default.json');
var EventEmitter = require('events');
var util = require('util');
var WebSocket = require('ws');

var PS2Socket = function (options) {
    if(options){
        for(option in config){
            if(!options[option])
                options[option] = config[option];
        }
    }
    else 
        options = config;

    EventEmitter.call(this);
    var self = this;
    this.socket = {};

    function connect() {
        self.socket = new WebSocket(options.socket_url + options.service_id);

        self.socket.on('open', function () {
            self.emit('open', new Date());
        });

        self.socket.on('message', function (data) {
            var dataObj = JSON.parse(data);
            if (dataObj.type == "serviceMessage") {
                dataObj.payload.timestamp *= 1000;
                dataObj.payload.received = Date.now();
                self.emit("event", dataObj.payload);
            }
            if (dataObj.type == "serviceStateChanged") {
                self.emit("service", dataObj);
            }
            if(dataObj.type == "heartbeat") {
                self.emit("heartbeat", dataObj);
            }
        });

        self.socket.on('close', function () {
            self.emit('close', new Date());
            setTimeout(connect, options.reconnect_delay);
        });
    }

    connect();
};

util.inherits(PS2Socket, EventEmitter);

PS2Socket.prototype.send = function (message, options, callback) {
    this.socket.send(message, options, callback);
};

module.exports = PS2Socket;