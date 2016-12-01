/**
 * Created by jayam on 10/31/16.
 */
var mongo = require('../db/myMongo.js');

module.exports.newAdvertisement = function (msg, callback) {
  var res = {};
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('advertisements');
     coll.insertOne(msg, function (err, results) {
      if (err) {
        console.log('An error - ', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        res = results;
        // console.log('ZZZ ' + JSON.stringify(res) + ' ZZZ');
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  });
};

module.exports.getAllAdvertisements = function (msg, callback) {
  var res = {};
  var whereParams = {quantity: {$gt: 0}};
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('advertisements');
    console.log('msg received at ', msg);
    console.log('connected to mdb advertisements');
    coll.find(whereParams).toArray(function (err, results) {
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