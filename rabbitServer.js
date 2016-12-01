/**
* Created by jayam on 10/28/16.
*/
var amqp = require('amqp');
var util = require('util');
var loginService = require('./services/login');
var advetisementsService = require('./services/advertisements');
var registrationService= require('./services/registration');
var bidsService = require('./services/bids');
var transactionsService = require('./services/transactions');
var cartService = require('./services/cart');

var connection = amqp.createConnection({host:'127.0.0.1'});
connection.on('ready',function() {
console.log('server on ready');

/////////////////loginQueue/////////////////
connection.queue('login_queue', function (q) {
  console.log('server subscribing for ', q.name);
  q.subscribe(function (message, headers, deliveryInfo, m) {
    console.log('Recevied message at login_queue' + ' -- ' + Date.now())
    util.log('#1 ' + util.format(deliveryInfo.routingKey, message));
    util.log('#2 ' + "Message: " + JSON.stringify(message));
    util.log('#3 ' + "DeliveryInfo: " + JSON.stringify(deliveryInfo));

    var payload = message.payload;
    var target = message.target;
    console.log(payload);
    console.log(target);
    loginService[target](payload, function (err, results) {
      console.log('finished processing at server, now publishing to reply queue- ' + m.replyTo + ' -- ' + Date.now());
      connection.publish(m.replyTo, results, {
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        correlationId: m.correlationId
      });
    });
  });
});

/////////////////AdvertisementsQueue/////////////////
connection.queue('advertisments_queue', function (q) {
  console.log('server subscribing for ', q.name);
  q.subscribe(function (message, headers, deliveryInfo, m) {
    console.log('Recevied message at advertisments_queue' + ' -- ' + Date.now())
    // util.log('#1 ' + util.format(deliveryInfo.routingKey, message));
    // util.log('#2 ' + "Message: " + JSON.stringify(message));
    // util.log('#3 ' + "DeliveryInfo: " + JSON.stringify(deliveryInfo));

    var payload = message.payload;
    var target = message.target;
    console.log('given target is '+target)
    advetisementsService[target](payload, function (err, results) {
    console.log('finished processing at server, now publishing to reply queue- ' + m.replyTo + ' -- ' + Date.now());
      connection.publish(m.replyTo, results, {
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        correlationId: m.correlationId
      });
    });
  });
});

/////////////////RegistrationQueue/////////////////
connection.queue('registration_queue', function (q) {
  console.log('server subscribing for ', q.name);
  q.subscribe(function (message, headers, deliveryInfo, m) {
    console.log('Recevied message at advertisments_queue' + ' -- ' + Date.now())
    util.log('#1 ' + util.format(deliveryInfo.routingKey, message));
    util.log('#2 ' + "Message: " + JSON.stringify(message));
    util.log('#3 ' + "DeliveryInfo: " + JSON.stringify(deliveryInfo));

    var payload = message.payload;
    var target = message.target;
    registrationService[target](payload, function (err, results) {

      // console.log('finished processing at server, now publishing to reply queue- ' + m.replyTo + ' -- ' + Date.now());
      connection.publish(m.replyTo, results, {
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        correlationId: m.correlationId
      });
    });
  });
});

/////////////////BidsQueue/////////////////
connection.queue('bids_queue', function (q) {
    console.log('server subscribing for ', q.name);
    q.subscribe(function (message, headers, deliveryInfo, m) {
      console.log('Recevied message at bids quque' + ' -- ' + Date.now())
      util.log('#2 ' + "Message: " + JSON.stringify(message));

      var payload = message.payload;
      var target = message.target;
      console.log('given target is '+target)
      bidsService[target](payload, function (err, results) {
        console.log('finished processing at server, now publishing to reply queue- ' + m.replyTo + ' -- ' + Date.now());
        connection.publish(m.replyTo, results, {
          contentType: 'application/json',
          contentEncoding: 'utf-8',
          correlationId: m.correlationId
        });
      });
    });
  });

/////////////////TransactionsQueue/////////////////
  connection.queue('transactions_queue', function (q) {
    console.log('server subscribing for ', q.name);
    q.subscribe(function (message, headers, deliveryInfo, m) {
      console.log('Recevied message at transactions quque' + ' -- ' + Date.now())
      util.log('#2 ' + "Message: " + JSON.stringify(message));
      var payload = message.payload;
      var target = message.target;
      console.log('given target is '+target)
      transactionsService[target](payload, function (err, results) {
        console.log('finished processing at server, now publishing to reply queue- ' + m.replyTo + ' -- ' + Date.now());
        connection.publish(m.replyTo, results, {
          contentType: 'application/json',
          contentEncoding: 'utf-8',
          correlationId: m.correlationId
        });
      });
    });
  });

/////////////////CartQueue/////////////////
  connection.queue('cart_queue', function (q) {
    console.log('server subscribing for ', q.name);
    q.subscribe(function (message, headers, deliveryInfo, m) {
      console.log('Recevied message at cart_queue' + ' -- ' + Date.now())
      util.log('#2 ' + "Message: " + JSON.stringify(message));
      var payload = message.payload;
      var target = message.target;
      console.log('given target is '+target)
      cartService[target](payload, function (err, results) {
        console.log('finished processing at server, now publishing to reply queue- ' + m.replyTo + ' -- ' + Date.now());
        connection.publish(m.replyTo, results, {
          contentType: 'application/json',
          contentEncoding: 'utf-8',
          correlationId: m.correlationId
        });
      });
    });
  });
});