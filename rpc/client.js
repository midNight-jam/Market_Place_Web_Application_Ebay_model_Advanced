/**
 * Created by jayam on 10/28/16.
 */
var amqp = require('amqp');
var connection = amqp.createConnection({host:'127.0.01'});
var amqrpc = require('./amqprpc');
var rpc = new amqrpc(connection);

function make_request(queue_name,msg_payload,callback) {
  rpc.makeRequest(queue_name, msg_payload, function (err, response) {
    console.log('call back of actual request');
    // callback("GREAT ERROR", null);

    if (err) {
      callback("GREAT ERROR", null);
    }
    else {
      callback(null, response);
    }
  });
}
module.exports.make_request = make_request;