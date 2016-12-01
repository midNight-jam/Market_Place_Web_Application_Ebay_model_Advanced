/**
 * Created by jayam on 10/28/16.
 */
var amqp = require('amqp');
var crypto = require('crypto');

var TIMEOUT = 28000;
var CONTENT_TYPE = 'application/json';
var CONTENT_ENCODING = 'utf-8';
var self;

exports = module.exports = AmqpRpc;

function AmqpRpc(connection) {
    self = this;
    this.connection = connection;
    this.requests = {};
    this.response_queue = false;
};

AmqpRpc.prototype.makeRequest = function(queue_name, msg_payload, callback) {
    self = this;
    var correlationId = crypto.randomBytes(16).toString('hex');
    var tId = setTimeout(function (corrId) {
        callback(new Error('timeout ', corrId));
        delete self.requests[corrId];
    }, TIMEOUT, correlationId);

    var entry = {
        callback: callback,
        timeout: tId
    };

    console.log('Pushing Entry in queue - '+entry);

    self.requests[correlationId] = entry;

    self.setupResponseQueue(function () {
      console.log('publishing entry '+ correlationId+' -- '+Date.now());
        self.connection.publish(queue_name, msg_payload, {
            correlationId: correlationId,
            contentType: CONTENT_TYPE,
            contentEncoding: CONTENT_ENCODING,
            replyTo: self.response_queue
        });
    });
};

AmqpRpc.prototype.setupResponseQueue = function(next) {
    if (this.response_queue) {
        console.log('As response que already present, moving ahead to publish in msgque - '+next);
        return next();
    }

    var self = this;
    self.connection.queue('',{exclusive:true},function(q){
        console.log('initializing response queue name  - '+q.name);
        self.response_queue = q.name;
        q.subscribe(function(message , headers, deliveryInfo, m){
            console.log('subscribing at respose queue - '+q.name+' -- '+Date.now());
            console.log('received message '+m.correlationId+' -- '+Date.now());
            var correlationId = m.correlationId;
            if(correlationId in self.requests){
                var entry = self.requests[correlationId];
                clearTimeout(entry.timeout);
                delete self.requests[correlationId];
                entry.callback(null,message);
            }
        });
        return next();
    });
};