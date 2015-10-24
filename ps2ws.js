/**
 * Created by Pepper on 10/18/2015.
 */

process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var config = require('config');
var EventEmitter = require('events');
var util = require('util');
var WebSocket = require('ws');

var PS2Socket = function (options) {
    EventEmitter.call(this);
    var self = this;
    this.socket = {};

    config.util.extendDeep(config, options);
    config.util.setModuleDefaults('ps2ws', config);

    function connect() {
        self.socket = new WebSocket(config.get('ps2ws.socket_url') + config.get('ps2ws.service_id'));

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
            setTimeout(connect, config.get('ps2ws.reconnect_delay'));
        });
    }

    connect();
};

util.inherits(PS2Socket, EventEmitter);

PS2Socket.prototype.send = function (message, options, callback) {
    this.socket.send(message, options, callback);
};

module.exports = PS2Socket;