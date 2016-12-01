/**
 * Created by jayam on 10/31/16.
 */
var mongo = require('../db/myMongo.js');
var ObjectID = require('mongodb').ObjectID;

module.exports.getUserWonBids = function(msg,callback) {
  var res = {};
  console.log('msg at update Bid');
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('bids');
    var obj_id = new ObjectID(msg.id);
    var criteria = {bidder:msg.name,enddate:{$lt:new Date()}};
    console.log(criteria);
    coll.find(criteria).toArray(function (err, results) {
      if (err) {
        console.log('some err');
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        res = results;
        console.log('seems working ', res);
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  })
};

module.exports.updateBid = function(msg,callback) {
  var res = {};
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('bids');
    var obj_id = new ObjectID(msg.id);
    coll.update({_id: obj_id}, {$max: {bidamount: msg.bidamount}, $set: {bidder: msg.bidder}}, function (err, results) {
      if (err) {
        console.log('some err', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        res = results;
        console.log('seems working ', res);
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  })
};

module.exports.newBid = function (msg, callback) {
  var res = {};
  console.log('msg at newBid', msg);
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('bids');
    msg.enddate = new Date((new Date()).getTime() + (4 * 86400000));
    coll.insertOne(msg, function (err, results) {
      console.log('msg at newBid', msg);
      if (err) {
        console.log('An error - ', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        res = results;
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  });
};

module.exports.getAllBids = function (msg, callback) {
  var res = {};
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('bids');
    coll.find({enddate: {$gt: new Date()}}).toArray(function (err, results) {
      var i = 0;
      if (err) {
        console.log('An error - ', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        console.log(results);
        res = results;
        console.log('ZZZ ' + JSON.stringify(res) + ' ZZZ');
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  });
};